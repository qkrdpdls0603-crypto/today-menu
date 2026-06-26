import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPageEdit = ({ onSaveSuccess }) => {
  const [nickname, setNickname] = useState('');
  const [allergies, setAllergies] = useState('');
  
  // 💡 [필드명 통일] 선호/기피 음식 상태 관리를 likes, dislikes로 명확히 통일
  const [likes, setLikes] = useState([]); 
  const [dislikes, setDislikes] = useState([]);
  
  // 입력창 임시 상태값
  const [inputLike, setInputLike] = useState('');
  const [inputDislike, setInputDislike] = useState('');
  
  const [loading, setLoading] = useState(true);

  // 1. 초기 기존 유저 데이터 로드
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        const res = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const u = res.data;
        setNickname(u.nickname || '');
        setAllergies(u.allergies || '');
        // 💡 백엔드에서 받은 preferences JSON 내 likes, dislikes 배열을 가져옴
        setLikes(u.preferences?.likes || []);
        setDislikes(u.preferences?.dislikes || []);
      } catch (err) {
        console.error(err);
        alert('유저 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  // 2. 좋아하는 음식 추가 및 삭제 핸들러
  const handleAddLike = () => {
    const value = inputLike.trim();
    if (value && !likes.includes(value)) {
      setLikes([...likes, value]);
      setInputLike('');
    }
  };

  const handleRemoveLike = (target) => {
    setLikes(likes.filter(item => item !== target));
  };

  // 3. 기피하는 음식 추가 및 삭제 핸들러
  const handleAddDislike = () => {
    const value = inputDislike.trim();
    if (value && !dislikes.includes(value)) {
      setDislikes([...dislikes, value]);
      setInputDislike('');
    }
  };

  const handleRemoveDislike = (target) => {
    setDislikes(dislikes.filter(item => item !== target));
  };

  // 4. 💡 [핵심] 서버로 수정된 데이터 저장 전송 (PUT /auth/me)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert('닉네임은 공백일 수 없습니다.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      // 💡 백엔드 routes.py의 update_me 명세와 100% 일치하는 payload 포맷팅
      const payload = {
        nickname: nickname.strip ? nickname.strip() : nickname.trim(),
        allergies: allergies,
        likes: likes,       // 백엔드의 data.get('likes') 수신부와 일치
        dislikes: dislikes, // 백엔드의 data.get('dislikes') 수신부와 일치
      };

      const response = await axios.put('/auth/me', payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('정보가 성공적으로 수정되었습니다!');
      if (onSaveSuccess) onSaveSuccess(response.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div style={styles.center}>로딩 중...</div>;

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>📝 내 정보 수정</h3>
        
        {/* 닉네임 입력 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>닉네임</label>
          <input 
            type="text" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            style={styles.input}
          />
        </div>

        {/* 알러지 입력 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>알러지 / 제외 재료</label>
          <input 
            type="text" 
            value={allergies} 
            onChange={(e) => setAllergies(e.target.value)} 
            placeholder="예: 견과류, 오이"
            style={styles.input}
          />
        </div>

        {/* 좋아하는 음식 관리 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>👍 좋아하는 음식 추가</label>
          <div style={styles.row}>
            <input 
              type="text" 
              value={inputLike} 
              onChange={(e) => setInputLike(e.target.value)} 
              placeholder="예: 삼겹살" 
              style={styles.inlineInput}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLike())}
            />
            <button type="button" onClick={handleAddLike} style={styles.addButton}>추가</button>
          </div>
          <div style={styles.tagContainer}>
            {likes.map((item, idx) => (
              <span key={idx} style={styles.likeTag}>
                {item}
                <button type="button" onClick={() => handleRemoveLike(item)} style={styles.tagDelBtn}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* 기피하는 음식 관리 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>👎 기피하는 음식 추가</label>
          <div style={styles.row}>
            <input 
              type="text" 
              value={inputDislike} 
              onChange={(e) => setInputDislike(e.target.value)} 
              placeholder="예: 민트초코" 
              style={styles.inlineInput}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDislike())}
            />
            <button type="button" onClick={handleAddDislike} style={styles.addButton}>추가</button>
          </div>
          <div style={styles.tagContainer}>
            {dislikes.map((item, idx) => (
              <span key={idx} style={styles.dislikeTag}>
                {item}
                <button type="button" onClick={() => handleRemoveDislike(item)} style={styles.tagDelBtn}>×</button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" style={styles.submitButton}>저장 완료</button>
      </form>
    </div>
  );
};

// ── 내부 인라인 스타일 정의 ───────────────────────────────────────────
const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', fontSize: '16px' },
  form: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' },
  formTitle: { margin: '0 0 20px 0', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555', fontSize: '14px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' },
  row: { display: 'flex', gap: '10px' },
  inlineInput: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  addButton: { padding: '10px 16px', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' },
  likeTag: { backgroundColor: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' },
  dislikeTag: { backgroundColor: '#fff1f0', color: '#ff4d4f', border: '1px solid #ffa39e', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' },
  tagDelBtn: { border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', fontSize: '14px', padding: 0, fontWeight: 'bold' },
  submitButton: { width: '100%', padding: '12px', backgroundColor: '#1890ff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default MyPageEdit;