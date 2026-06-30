import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  // useLocation은 사용자가 현재 머물고 있는 '주소 경로'를 감시합니다.
  const { pathname } = useLocation()

  useEffect(() => {
    // 주소(pathname)가 바뀔 때마다 브라우저 창의 스크롤을 맨 위(X:0, Y:0)로 땡겨줍니다.
    window.scrollTo(0, 0)
  }, [pathname])

  return null // 화면에 아무것도 그리지 않는 유령 컴포넌트입니다.
}