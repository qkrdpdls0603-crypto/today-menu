import { useState, useEffect } from 'react'
import { getMyPage, updateMe, toggleLike } from '../api/services'
import { useAuth } from '../App'

const PREFS    = ['한식','일식','중식','양식','분식','치킨','피자','카페','채식','해산물']
const DISLIKES = ['오이','고수','파','마늘','쑥갓','가지','당근','콩']

export default function MyPage() {
  const { user: authUser, login: ctxLogin } = useAuth()
  const [data,    setData]    = useState(null)
  const [tab,     setTab]     = useState('activity')  // activity | wishlist
  const [editing, setEditing] = useState(false)
  const [form,    setForm]    = useState({})
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    getMyPage().then(d => {
      setData(d)
      setForm({
        nickname:    d.user.nickname,
        allergies:   d.user.allergies || '',
        preferences: (d.user.preferences?.likes   || []),
        dislikes:    (d.user.preferences?.dislikes || []),
      })
    }).catch(() => {})
  }, [])

  const toggleChip = (val, key) =>
    setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val] }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateMe(form)
      setData(d => ({ ...d, user: updated }))
      ctxLogin(updated)
      setEditing(false)
    } catch (e) {
      alert(e.response?.data?.message ?? '오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleLike = async (logId) => {
    const res = await toggleLike(logId)
    setData(d => ({
      ...d,
      rec_logs: d.rec_logs.map(r => r.log_id === logId ? { ...r, is_liked: res.liked } : r),
    }))
  }

  if (!data) return <div className="flex justify-center items-center h-64 text-gray-400">로딩 중...</div>

  const { user, my_parties, rec_logs } = data
  const mannerPct = Math.min((user.manner_score / 50) * 100, 100)
  const circumference = 2 * Math.PI * 36

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-black">마이 메이지</h1>

      {/* 히어로 배너 */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 flex items-start gap-5 flex-wrap">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl font-black flex-shrink-0">
          {user.nickname?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">MY PAGE</p>
          <h2 className="text-xl font-black mb-1">나의 메뉴 취향과 활동을 한눈에 확인하세요.</h2>
          <p className="text-sm text-white/60 mb-3">찜한 메뉴, 프로필, 추천 기록, 매칭 내역을 관리하는 마이페이지입니다.</p>
          <button onClick={() => setEditing(e => !e)} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg">
            {editing ? '취소' : '프로필 수정 →'}
          </button>
        </div>
        {/* 매너 온도 게이지 */}
        <div className="flex flex-col items-center flex-shrink-0">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="7"/>
            <circle cx="45" cy="45" r="36" fill="none" stroke="#F6AD55" strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - mannerPct / 100)}
              transform="rotate(-90 45 45)"
              style={{ transition: 'stroke-dashoffset 1s' }}/>
            <text x="45" y="45" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="800">
              {user.manner_score}
            </text>
            <text x="45" y="62" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="10">°C</text>
          </svg>
          <p className="text-xs text-white/50 mt-1">매너온도</p>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['찜한 메뉴',   rec_logs.filter(r => r.is_liked).length + '개'],
          ['추천 활동',   rec_logs.length + '회'],
          ['매칭 기록',   my_parties.length + '건'],
          ['매너점수',    user.manner_score + '°'],
        ].map(([label, val]) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-2xl font-black">{val}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* 프로필 편집 */}
      {editing && (
        <div className="card p-6 space-y-4">
          <h3 className="font-bold">✏️ 프로필 수정</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">닉네임</label>
            <input className="input" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">알러지/제외 재료</label>
            <input className="input" placeholder="오이, 갑각류..." value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">좋아하는 음식</label>
            <div className="flex flex-wrap gap-2">
              {PREFS.map(p => (
                <button type="button" key={p} onClick={() => toggleChip(p, 'preferences')}
                  className={`px-3 py-1 rounded-full border text-sm font-semibold transition-colors
                    ${form.preferences.includes(p) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">싫어하는 음식</label>
            <div className="flex flex-wrap gap-2">
              {DISLIKES.map(d => (
                <button type="button" key={d} onClick={() => toggleChip(d, 'dislikes')}
                  className={`px-3 py-1 rounded-full border text-sm font-semibold transition-colors
                    ${form.dislikes.includes(d) ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? '저장 중...' : '저장'}</button>
            <button onClick={() => setEditing(false)} className="btn-secondary">취소</button>
          </div>
        </div>
      )}

      {/* 프로필 정보 */}
      {!editing && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-bold mb-3">프로필</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">닉네임</span><span className="ml-3 font-semibold">{user.nickname}</span></div>
              <div><span className="text-gray-400">이메일</span><span className="ml-3">{user.email}</span></div>
              <div>
                <span className="text-gray-400">선호 메뉴</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(user.preferences?.likes || []).map(p => <span key={p} className="badge badge-info">{p}</span>)}
                  {!(user.preferences?.likes?.length) && <span className="text-gray-300 text-xs">없음</span>}
                </div>
              </div>
              <div>
                <span className="text-gray-400">알러지</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(user.allergies || '').split(',').filter(Boolean).map(a => <span key={a} className="badge badge-warning">{a.trim()}</span>)}
                  {!user.allergies && <span className="text-gray-300 text-xs">없음</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-bold mb-3">내 파티</h3>
            {my_parties.length === 0
              ? <p className="text-gray-400 text-sm">참여한 파티가 없습니다</p>
              : <div className="space-y-2">
                  {my_parties.map(p => (
                    <div key={p.party_id} className="flex items-center gap-2 text-sm border-b border-gray-50 pb-2">
                      <span className={`badge ${p.status === 'RECRUITING' ? 'badge-success' : 'badge-info'}`}>
                        {p.status === 'RECRUITING' ? '모집중' : p.status}
                      </span>
                      <span className="font-semibold truncate">{p.title}</span>
                      <span className="text-gray-400 text-xs ml-auto flex-shrink-0">{p.member_count}/{p.max_people}</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      )}

      {/* 탭 — 활동내역 / 찜목록 */}
      <div>
        <div className="flex gap-1 border-b border-gray-200 mb-4">
          {[['activity','활동 내역'],['wishlist','찜 목록']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors
                ${tab === key ? 'border-red-500 text-gray-900' : 'border-transparent text-gray-400'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'activity' && (
          <div className="grid md:grid-cols-3 gap-3">
            {rec_logs.length === 0
              ? <p className="text-gray-400 text-sm col-span-full">활동 내역이 없습니다</p>
              : rec_logs.map(log => (
                  <div key={log.log_id} className="card p-4 flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-lg flex-shrink-0">🤖</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">추천</p>
                      <p className="font-semibold text-sm truncate">{log.restaurant?.name || '식당'}</p>
                      <p className="text-xs text-gray-400">{log.restaurant?.category}</p>
                    </div>
                    <button onClick={() => handleLike(log.log_id)}
                      className={`text-xl flex-shrink-0 ${log.is_liked ? 'text-red-500' : 'text-gray-200'}`}>
                      ❤️
                    </button>
                  </div>
                ))
            }
          </div>
        )}

        {tab === 'wishlist' && (
          <div>
            {rec_logs.filter(r => r.is_liked).length === 0
              ? <p className="text-gray-400 text-sm">찜한 항목이 없습니다</p>
              : <div className="grid md:grid-cols-3 gap-3">
                  {rec_logs.filter(r => r.is_liked).map(log => (
                    <div key={log.log_id} className="card p-4 flex gap-3 items-center">
                      <span className="text-2xl">🍴</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{log.restaurant?.name}</p>
                        <p className="text-xs text-gray-400">{log.restaurant?.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}
