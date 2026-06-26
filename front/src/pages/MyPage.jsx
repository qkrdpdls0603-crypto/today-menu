import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const [myParties, setMyParties] = useState([]);
  const [recLogs, setRecLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 💡 [CORS 완화] __init__.py의 허용 도메인과 싱크를 맞추기 위해 localhost 대신 127.0.0.1로 고정합니다.
  const BACKEND_URL = 'http://127.0.0.1:5000';

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        // 💡 지정한 BACKEND_URL(127.0.0.1) 주소로 정확하게 API를 찌릅니다.
        const res = await axios.get(`${BACKEND_URL}/mypage/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserData(res.data.user);
        setMyParties(res.data.my_parties || []);
        setRecLogs(res.data.rec_logs || []);
      } catch (err) {
        console.error("마이페이지 데이터를 불러오는데 실패했습니다.", err);
        // 401(토큰만료/인증불가) 에러 발생 시 처리
        if (err.response?.status === 401 || err.response?.status === 422) {
          setError('인증 세션이 만료되었거나 올바르지 않습니다. 로그아웃 후 다시 로그인 해주세요.');
        } else {
          setError(err.response?.data?.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, []);

  if (loading) return <div style={styles.center}>데이터를 불러오는 중입니다...</div>;
  if (error) return <div style={{ ...styles.center, color: 'red', textAlign: 'center', lineHeight: '1.5' }}>{error}</div>;
  if (!userData) return <div style={styles.center}>유저 정보가 없습니다.</div>;

  // 💡 [데이터 클렌징] DB에 문장이나 콤마 형태로 잘못 꼬여 들어간 텍스트들을 정상 배열로 복구하고 중복을 제거합니다.
  const processTags = (rawPrefs) => {
    if (!rawPrefs) return [];
    if (Array.isArray(rawPrefs)) {
      // ["오이, 고등어, 낙지", "한식"] 형태로 들어올 경우를 대비해 전부 분할(flatMap)합니다.
      const flatList = rawPrefs.flatMap(item => typeof item === 'string' ? item.split(',') : item);
      // 공백 제거 후, 중복을 원천 차단하기 위해 Set 객체를 활용합니다.
      return [...new Set(flatList.map(v => v.trim()).filter(Boolean))];
    }
    return [];
  };

  const likes = processTags(userData.preferences?.likes);
  const dislikes = processTags(userData.preferences?.dislikes);
  const savedLocations = userData.preferences?.saved_locations || [];

  return (
    <div style={styles.container}>
      {/* 1. 프로필 섹션 */}
      <div style={styles.card}>
        <h2 style={styles.title}>{userData.nickname}님의 프로필</h2>
        
        <p style={styles.text}><strong>이메일:</strong> {userData.email}</p>
        <p style={styles.text}><strong>매너 지수:</strong> {userData.manner_score}°C</p>
        <p style={styles.text}><strong>알러지/제외 성분:</strong> {userData.allergies || '없음'}</p>
      </div>

      {/* 2. 취향 정보 섹션 */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>🍽️ 나의 음식 취향</h3>
        
        <div style={styles.subSection}>
          <h4 style={styles.likeTitle}>👍 좋아하는 음식</h4>
          {likes.length > 0 ? (
            <div style={styles.tagContainer}>
              {likes.map((item, idx) => <span key={idx} style={styles.likeTag}>{item}</span>)}
            </div>
          ) : (
            <p style={styles.emptyText}>등록된 선호 음식이 없습니다.</p>
          )}
        </div>

        <div style={styles.subSection}>
          <h4 style={styles.dislikeTitle}>👎 기피하는 음식</h4>
          {dislikes.length > 0 ? (
            <div style={styles.tagContainer}>
              {dislikes.map((item, idx) => <span key={idx} style={styles.dislikeTag}>{item}</span>)}
            </div>
          ) : (
            <p style={styles.emptyText}>등록된 기피 음식이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 3. 저장된 장소 섹션 */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📍 저장된 장소 (최대 3개)</h3>
        {savedLocations.length > 0 ? (
          <ul style={styles.list}>
            {savedLocations.map((loc, idx) => (
              <li key={idx} style={styles.listItem}>
                <strong>{loc.name}</strong> <span style={styles.addressText}>({loc.address || '주소 없음'})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.emptyText}>자주 가는 장소를 등록해 보세요.</p>
        )}
      </div>

      {/* 4. 나의 밥친구 파티 내역 */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>👥 참여 중인 파티 목록 (최근 5개)</h3>
        {myParties.length > 0 ? (
          <div style={styles.grid}>
            {myParties.map((party) => (
              <div key={party.party_id} style={styles.partyItem}>
                <h4 style={{ margin: '0 0 8px 0' }}>{party.title}</h4>
                <p style={styles.smallText}>📍 식당: {party.restaurant?.name || '미정'}</p>
                <p style={styles.smallText}>⏰ 일시: {new Date(party.meeting_time).toLocaleString()}</p>
                <p style={styles.smallText}>👥 인원: {party.member_count} / {party.max_people}명</p>
                <span style={party.status === 'RECRUITING' ? styles.badgeOpen : styles.badgeClose}>
                  {party.status === 'RECRUITING' ? '모집중' : '마감'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>참여 중인 밥친구 파티가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

// ── 컴포넌트 내부 스타일 가이드 ──────────────────────────────────
const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', fontSize: '18px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' },
  title: { margin: '0 0 15px 0', color: '#333' },
  sectionTitle: { margin: '0 0 15px 0', borderBottom: '2px solid #eee', paddingBottom: '8px', color: '#222' },
  subSection: { marginBottom: '15px' },
  likeTitle: { margin: '0 0 8px 0', color: '#1890ff' },
  dislikeTitle: { margin: '0 0 8px 0', color: '#ff4d4f' },
  text: { margin: '6px 0', color: '#555', fontSize: '15px' },
  smallText: { margin: '4px 0', color: '#666', fontSize: '13px' },
  addressText: { color: '#888', fontSize: '13px' },
  emptyText: { color: '#aaa', fontSize: '14px', margin: '5px 0' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { padding: '10px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', fontSize: '14px' },
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' },
  likeTag: { backgroundColor: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  dislikeTag: { backgroundColor: '#fff1f0', color: '#ff4d4f', border: '1px solid #ffa39e', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' },
  partyItem: { border: '1px solid #e8e8e8', padding: '12px', borderRadius: '8px', position: 'relative', backgroundColor: '#fafafa' },
  badgeOpen: { display: 'inline-block', marginTop: '8px', padding: '2px 8px', fontSize: '11px', backgroundColor: '#52c41a', color: '#fff', borderRadius: '4px' },
  badgeClose: { display: 'inline-block', marginTop: '8px', padding: '2px 8px', fontSize: '11px', backgroundColor: '#bfbfbf', color: '#fff', borderRadius: '4px' }
};

export default MyPage;