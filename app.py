from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__, static_folder='build', static_url_path='')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 최대 파일 크기 16MB 설정
CORS(app, resources={r"/*": {"origins": "*"}})

# 데이터 파일 경로 설정
USERS_FILE = 'users.json'
ACTIVITIES_FILE = 'activities.json'
COMMENTS_FILE = 'comments.json'


# JSON 파일에서 데이터를 로드하는 함수
def load_data(file_path, default_data):
    if not os.path.exists(file_path):
        save_data(file_path, default_data)
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


# JSON 파일에 데이터를 저장하는 함수
def save_data(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


# JSON 파일이 없을 경우 기본값으로 생성
load_data(USERS_FILE, {"users": []})
load_data(ACTIVITIES_FILE, {"activities": []})
load_data(COMMENTS_FILE, {"comments": []})


# React 앱 제공 (초기 경로)
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')


# React Router를 위한 모든 경로 처리
@app.route('/<path:path>')
def static_files(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


# 회원가입 API
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    users = load_data(USERS_FILE, {"users": []})["users"]

    if any(user['username'] == data['username'] for user in users):
        return jsonify({'status': 'error', 'message': 'ユーザー名が既に存在します。'}), 400

    new_user = {
        "id": len(users) + 1,
        "username": data['username'],
        "password": data['password'],
        "points": 20,
        "joinedActivities": []
    }

    users.append(new_user)
    save_data(USERS_FILE, {"users": users})

    return jsonify({'status': 'success', 'user': new_user})


# 로그인 API
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    users = load_data(USERS_FILE, {"users": []})["users"]

    user = next((u for u in users if u['username'] == data['username'] and u['password'] == data['password']), None)
    if not user:
        return jsonify({'status': 'error', 'message': 'ユーザー名またはパスワードが正しくありません。'}), 401

    return jsonify({'status': 'success', 'user': user})


# 모든 활동 데이터를 반환
@app.route('/activities', methods=['GET'])
def get_activities():
    activities = load_data(ACTIVITIES_FILE, {"activities": []})["activities"]
    return jsonify({"activities": sorted(activities, key=lambda x: x['date'])})


# 새로운 활동을 생성하고 저장
@app.route('/create-event', methods=['POST'])
def create_event():
    data = request.json
    activities = load_data(ACTIVITIES_FILE, {"activities": []})["activities"]

    # 같은 이름과 같은 날짜의 활동이 있는지 확인 (중복 방지)
    if any(activity['name'] == data['name'] and activity['date'] == data['date'] for activity in activities):
        return jsonify({'status': 'error', 'message': '同じ名前と日付のアクティビティが既に存在します。'}), 400

    new_activity = {
        "id": len(activities) + 1,
        "name": data.get('name', 'Unnamed Event'),
        "cost": data.get('cost', 0),
        "date": data.get('date', '未設定'),
        "time": data.get('time', '未設定'),
        "location": data.get('location', '未設定'),
        "organizer": data.get('organizer', '管理者'),
        "requiredParticipants": data.get('requiredParticipants', 1),
        "currentParticipants": data.get('currentParticipants', 0),
        "description": data.get('description', '')
    }

    activities.append(new_activity)
    save_data(ACTIVITIES_FILE, {"activities": activities})

    return jsonify({'status': 'Event created', 'event': new_activity})


# 인증 사진 업로드 시 10 포인트 추가 API
@app.route('/upload-photo', methods=['POST'])
def upload_photo():
    user_data = request.form
    file = request.files.get('photo')

    if not file:
        return jsonify({'status': 'error', 'message': '写真を選択してください。'}), 400

    # 안전한 파일 이름 생성 및 저장
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = secure_filename(f"{user_data['username']}_{timestamp}_{file.filename}")
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # 업로드 폴더가 없으면 생성
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    file.save(file_path)

    # 사용자 포인트 추가
    users = load_data(USERS_FILE, {"users": []})["users"]
    for user in users:
        if user['username'] == user_data['username']:
            user['points'] += 10
            save_data(USERS_FILE, {"users": users})
            return jsonify({'status': 'success', 'message': '写真がアップロードされました。10ポイントを取得しました！', 'user': user})

    return jsonify({'status': 'error', 'message': 'ユーザーが見つかりませんでした。'}), 404


if __name__ == '__main__':
    # JSON 데이터 파일이 없으면 자동 생성
    load_data(USERS_FILE, {"users": []})
    load_data(ACTIVITIES_FILE, {"activities": []})
    load_data(COMMENTS_FILE, {"comments": []})

    # 업로드 폴더 생성
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    app.run(host='0.0.0.0', port=5003)
