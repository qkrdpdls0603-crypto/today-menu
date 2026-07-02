import os
from pathlib import Path

# .env 파일 로드 (로컬용)
try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass

basedir      = Path(__file__).resolve().parent
instance_dir = basedir / 'instance'
instance_dir.mkdir(exist_ok=True)

# 환경변수 직접 확인 (디버깅용)
_db_url = os.environ.get('DATABASE_URL', '')
print(f"[CONFIG] DATABASE_URL = {_db_url[:30] if _db_url else 'NOT SET'}")

# Render는 postgres:// → postgresql:// 변환 필요
if _db_url.startswith('postgres://'):
    _db_url = _db_url.replace('postgres://', 'postgresql://', 1)

class Config:
    SECRET_KEY     = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-key'
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY') or ''

    SQLALCHEMY_DATABASE_URI = _db_url or (
        'sqlite:///' + str(instance_dir / 'dining.db').replace('\\', '/')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle':  300,
    }