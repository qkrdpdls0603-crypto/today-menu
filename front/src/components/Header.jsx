import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { logout } from '../api/services'

const NAV_LINKS = [
  { to: '/', label: '홈', end: true },
  { to: '/menu', label: '맛집 찾기' },
  { to: '/party', label: '밥친구' },
  { to: '/game', label: '게임찾기' },
]

const pageContainer = 'container'
const headerIconLink = 'inline-flex min-w-[70px] flex-col items-center justify-center gap-[5px] border-0 bg-transparent text-[0.78rem] font-black leading-none text-[#161211]'
const navLinkBase = 'flex h-full min-w-[82px] items-center justify-center rounded-b-lg px-[18px] text-[0.94rem] font-extrabold text-[#191210] transition duration-200 hover:bg-[linear-gradient(135deg,var(--color-primary),#F98385)] hover:text-white'
const navLinkActive = 'bg-[linear-gradient(135deg,var(--color-primary),#F98385)] text-white'
const mobileButton = 'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-0 px-6 text-[0.94rem] font-black transition duration-200'

export default function Header() {
  const { user, logout: ctxLogout } = useAuth()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [q, setQ] = useState('')

  const handleLogout = () => {
    logout()
    ctxLogout()
    navigate('/')
    setMobileOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) {
      navigate(`/menu?q=${encodeURIComponent(q)}`)
      setMobileOpen(false)
    }
  }

  const navCls = ({ isActive }) =>
    `${navLinkBase} ${isActive ? navLinkActive : ''}`

  return (
    <>
      {/* ✅ HEADER */}
      <header className="fixed inset-x-0 top-0 z-[500] h-[var(--header-h)] border-b border-[rgba(243,231,221,0.9)] bg-white/95 backdrop-blur-2xl">
        <div className={`${pageContainer} grid h-full grid-cols-[minmax(220px,1fr)_minmax(340px,420px)_minmax(220px,1fr)] items-center gap-6 max-lg:grid-cols-[auto_minmax(240px,1fr)_auto] max-md:grid-cols-[1fr_auto]`}>

          {/* ✅ 로고 */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[1.72rem] font-black tracking-[-0.04em] text-[#0E0C0B] max-md:text-[1.35rem]"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src="/img/icon/logo.png"
              alt="오늘 뭐먹지?"
              className="h-8 w-auto object-contain max-md:h-6"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span>오늘 뭐먹지?</span>
          </Link>

          {/* ✅ 검색창 */}
          <div className="max-md:hidden">
            <form
              onSubmit={handleSearch}
              className="flex h-12 overflow-hidden rounded-[10px] border-[1.5px] border-[rgba(244,108,111,0.8)] bg-white shadow-[0_4px_18px_rgba(244,108,111,0.08)]"
            >
              <input
                type="text"
                placeholder="식당명, 메뉴 검색..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="flex-1 px-[18px] text-[0.92rem] font-semibold outline-0"
              />
              <button
                type="submit"
                className="w-12 bg-[linear-gradient(135deg,var(--color-primary),#F98082)] text-white"
              >
                ⌕
              </button>
            </form>
          </div>

          {/* ✅ 오른쪽 아이콘 */}
          <div className="flex items-center justify-end gap-[26px] text-[0.9rem] font-extrabold">

            {user ? (
              <button onClick={handleLogout} className={`${headerIconLink} max-md:hidden`}>
                <img src="/img/logout.png" className="h-[35px]" alt="logout" />
              </button>
            ) : (
              <>
                <Link to="/login" className={`${headerIconLink} max-md:hidden`}>
                  <img src="/img/login.png" className="h-[35px]" alt="login" />
                </Link>
              </>
            )}

            <button
              className="hidden text-2xl max-md:inline-flex"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? '×' : '☰'}
            </button>

          </div>
        </div>
      </header>

      {/* ✅ NAV */}
      <nav className="fixed inset-x-0 top-[var(--header-h)] z-[490] h-[var(--nav-h)] bg-white max-md:hidden border-b">
        <div className={`${pageContainer} flex h-full items-center`}>
          <div className="flex gap-6">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={navCls}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* ✅ 모바일 메뉴 */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-[800]"
          />

          <div className="fixed right-0 top-0 bottom-0 w-[300px] bg-white z-[810] shadow-lg p-5">

            <div className="flex justify-between mb-4">
              <span className="font-bold">메뉴</span>
              <button onClick={() => setMobileOpen(false)}>×</button>
            </div>

            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="block py-3 border-b"
              >
                {label}
              </Link>
            ))}

          </div>
        </>
      )}
    </>
  )
}