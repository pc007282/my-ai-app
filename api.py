from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove
from PIL import Image
import io
import os
import uuid

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # 允許前端連線

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "請上傳圖片檔案"}), 400
        file = request.files['file']
        if not file or file.filename == '':
            return jsonify({"error": "檔案無效"}), 400
        if file.size > 5 * 1024 * 1024:  # 限制 5MB
            return jsonify({"error": "檔案不能超過 5MB"}), 400
        if file and file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filename = f"{uuid.uuid4()}_{file.filename}"
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            file_url = f"/uploads/{filename}"
            return jsonify({"file_url": file_url}), 200
        return jsonify({"error": "只支援 JPG 或 PNG 格式"}), 400
    except Exception as e:
        return jsonify({"error": f"上傳失敗：{str(e)}"}), 500

@app.route('/api/remove-background', methods=['POST'])
def remove_background():
    try:
        data = request.get_json()
        image_url = data.get('image_url')
        if not image_url:
            return jsonify({"error": "請提供圖片網址"}), 400
        image_path = os.path.join(UPLOAD_FOLDER, image_url.split('/')[-1])
        if not os.path.exists(image_path):
            return jsonify({"error": "圖片不存在"}), 404
        input_image = Image.open(image_path)
        output_image = remove(input_image)  # 用 AI 去背
        output_filename = f"{uuid.uuid4()}.png"
        output_path = os.path.join(PROCESSED_FOLDER, output_filename)
        output_image.save(output_path, format="PNG")  # 存成透明 PNG
        processed_url = f"/processed/{output_filename}"
        return jsonify({
            "processed_image_url": processed_url,
            "status": "完成"
        }), 200
    except Exception as e:
        return jsonify({"error": f"去背失敗：{str(e)}"}), 500

@app.route('/processed/<filename>')
def serve_processed_image(filename):
    try:
        file_path = os.path.join(PROCESSED_FOLDER, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "檔案不存在"}), 404
        return send_file(file_path, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": f"下載失敗：{str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
