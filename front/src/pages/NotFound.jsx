import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'var(--bg-background)'
    }}>
      {/* 귀여운 에러 아이콘 스티커 느낌 */}
      <div style={{
        fontSize: '6rem',
        marginBottom: '10px',
        animation: 'bounce 2s infinite'
      }}>
        🚧
      </div>

      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: '10px'
      }}>
        공사 중이거나 찾을 수 없는 페이지입니다
      </h1>

      <p style={{
        fontSize: '1.1rem',
        color: '#6b7280',
        maxWidth: '450px',
        marginBottom: '30px',
        lineHeight: '1.6'
      }}>
        요청하신 페이지가 존재하지 않거나, <br />
        <strong>현재 팀원들이 열심히 개발 중인 공간</strong>입니다. <br />
        조금만 기다려주시면 멋진 기능으로 찾아올게요!
      </p>

      {/* 버튼 구역 (이전/홈) */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 20px',
            borderRadius: '24px', // 삼성 스타일 라운딩
            border: '1px solid #d1d5db',
            backgroundColor: '#fff',
            color: '#374151',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
        >
          이전 페이지로
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: '#F46C6F', // 프로젝트 포인트 컬러
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e05659'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#F46C6F'}
        >
          홈으로 가기
        </button>
      </div>

      {/* 간단한 바운스 애니메이션 주입 */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}