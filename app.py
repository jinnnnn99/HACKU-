from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from werkzeug.utils import secure_filename
from datetime import datetime
from bcrypt import hashpw, gensalt, checkpw

app = Flask(__name__, static_folder='build', static_url_path='')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 최대 파일 크기 16MB
CORS(app, resources={r"/*": {"origins": "*"}})

# JSON 파일 경로
USERS_FILE = 'users.json'
ACTIVITIES_FILE = 'activities.json'
COMMENTS_FILE = 'comments.json'

# JSON 데이터 로드 함수
def load_data(file_path, default_data):
    if not os.path.exists(file_path):
        save_data(file_path, default_data)
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# JSON 데이터 저장 함수
def save_data(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# JSON 파일이 없을 경우 기본값으로 생성
load_data(USERS_FILE, {"users": []})
load_data(ACTIVITIES_FILE, {"activities": []})
load_data(COMMENTS_FILE, {"comments": []})

# React 정적 파일 제공
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def catch_all(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# 사용자 등록 API
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    users = load_data(USERS_FILE, {"users": []})["users"]

    if any(user['username'] == data['username'] for user in users):
        return jsonify({'status': 'error', 'message': 'ユーザー名が既に存在します。'}), 400

    hashed_password = hashpw(data['password'].encode('utf-8'), gensalt()).decode('utf-8')

    new_user = {
        "id": len(users) + 1,
        "username": data['username'],
        "password": hashed_password,
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
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({'status': 'error', 'message': 'ユーザー名とパスワードを入力してください。'}), 400

    users = load_data(USERS_FILE, {"users": []})["users"]
    user = next((u for u in users if u['username'] == username), None)

    if not user:
        return jsonify({'status': 'error', 'message': '登録されていないアカウントです。'}), 401

    if not checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'status': 'error', 'message': 'パスワードが間違っています。'}), 401

    return jsonify({'status': 'success', 'user': user})

# 모든 아クティビティ取得
@app.route('/activities', methods=['GET'])
def get_activities():
    activities = load_data(ACTIVITIES_FILE, {"activities": []})["activities"]
    return jsonify({"activities": sorted(activities, key=lambda x: x['date'])})

# 특정 アクティビティ詳細取得
@app.route('/activity-details', methods=['GET'])
def get_activity_details():
    activities = load_data(ACTIVITIES_FILE, {"activities": []})["activities"]
    return jsonify({"activities": activities})

# 활동 생성 API
@app.route('/create-event', methods=['POST'])
def create_event():
    data = request.json
    activities = load_data(ACTIVITIES_FILE, {"activities": []})["activities"]

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

# 포인트 사용 API
@app.route('/use-points', methods=['POST'])
def use_points():
    data = request.json
    username = data.get("username")
    cost = data.get("cost")

    users = load_data(USERS_FILE, {"users": []})["users"]

    for user in users:
        if user["username"] == username:
            if user["points"] >= cost:
                user["points"] -= cost
                save_data(USERS_FILE, {"users": users})
                return jsonify({'status': 'success', 'remaining_points': user["points"]})
            else:
                return jsonify({'status': 'error', 'message': 'ポイントが不足しています。'}), 400

    return jsonify({'status': 'error', 'message': 'ユーザーが見つかりませんでした。'}), 404

# 인증 사진 업로드 API
@app.route('/upload-photo', methods=['POST'])
def upload_photo():
    user_data = request.form
    file = request.files.get('photo')

    if not file:
        return jsonify({'status': 'error', 'message': '写真を選択してください。'}), 400

    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename = secure_filename(f"{user_data['username']}_{timestamp}_{file.filename}")
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    file.save(file_path)

    users = load_data(USERS_FILE, {"users": []})["users"]
    for user in users:
        if user['username'] == user_data['username']:
            user['points'] += 10
            save_data(USERS_FILE, {"users": users})
            return jsonify({'status': 'success', 'message': '写真がアップロードされました。10ポイントを取得しました！', 'user': user})

    return jsonify({'status': 'error', 'message': 'ユーザーが見つかりませんでした。'}), 404

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(host='0.0.0.0', port=5003)
