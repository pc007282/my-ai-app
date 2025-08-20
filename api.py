{\rtf1\ansi\ansicpg950\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 from flask import Flask, request, send_file, jsonify\
from flask_cors import CORS\
from rembg import remove\
from PIL import Image\
import io\
import os\
import uuid\
\
app = Flask(__name__)\
CORS(app, resources=\{r"/api/*": \{"origins": "*"\}\})  # \uc0\u20801 \u35377 \u21069 \u31471 \u36899 \u32218 \
\
UPLOAD_FOLDER = 'uploads'\
PROCESSED_FOLDER = 'processed'\
os.makedirs(UPLOAD_FOLDER, exist_ok=True)\
os.makedirs(PROCESSED_FOLDER, exist_ok=True)\
\
@app.route('/api/upload', methods=['POST'])\
def upload_file():\
    try:\
        if 'file' not in request.files:\
            return jsonify(\{"error": "\uc0\u35531 \u19978 \u20659 \u22294 \u29255 \u27284 \u26696 "\}), 400\
        file = request.files['file']\
        if not file or file.filename == '':\
            return jsonify(\{"error": "\uc0\u27284 \u26696 \u28961 \u25928 "\}), 400\
        if file.size > 5 * 1024 * 1024:  # \uc0\u38480 \u21046  5MB\
            return jsonify(\{"error": "\uc0\u27284 \u26696 \u19981 \u33021 \u36229 \u36942  5MB"\}), 400\
        if file and file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):\
            filename = f"\{uuid.uuid4()\}_\{file.filename\}"\
            file_path = os.path.join(UPLOAD_FOLDER, filename)\
            file.save(file_path)\
            file_url = f"/uploads/\{filename\}"\
            return jsonify(\{"file_url": file_url\}), 200\
        return jsonify(\{"error": "\uc0\u21482 \u25903 \u25588  JPG \u25110  PNG \u26684 \u24335 "\}), 400\
    except Exception as e:\
        return jsonify(\{"error": f"\uc0\u19978 \u20659 \u22833 \u25943 \u65306 \{str(e)\}"\}), 500\
\
@app.route('/api/remove-background', methods=['POST'])\
def remove_background():\
    try:\
        data = request.get_json()\
        image_url = data.get('image_url')\
        if not image_url:\
            return jsonify(\{"error": "\uc0\u35531 \u25552 \u20379 \u22294 \u29255 \u32178 \u22336 "\}), 400\
        image_path = os.path.join(UPLOAD_FOLDER, image_url.split('/')[-1])\
        if not os.path.exists(image_path):\
            return jsonify(\{"error": "\uc0\u22294 \u29255 \u19981 \u23384 \u22312 "\}), 404\
        input_image = Image.open(image_path)\
        output_image = remove(input_image)  # \uc0\u29992  AI \u21435 \u32972 \
        output_filename = f"\{uuid.uuid4()\}.png"\
        output_path = os.path.join(PROCESSED_FOLDER, output_filename)\
        output_image.save(output_path, format="PNG")  # \uc0\u23384 \u25104 \u36879 \u26126  PNG\
        processed_url = f"/processed/\{output_filename\}"\
        return jsonify(\{\
            "processed_image_url": processed_url,\
            "status": "\uc0\u23436 \u25104 "\
        \}), 200\
    except Exception as e:\
        return jsonify(\{"error": f"\uc0\u21435 \u32972 \u22833 \u25943 \u65306 \{str(e)\}"\}), 500\
\
@app.route('/processed/<filename>')\
def serve_processed_image(filename):\
    try:\
        file_path = os.path.join(PROCESSED_FOLDER, filename)\
        if not os.path.exists(file_path):\
            return jsonify(\{"error": "\uc0\u27284 \u26696 \u19981 \u23384 \u22312 "\}), 404\
        return send_file(file_path, mimetype='image/png')\
    except Exception as e:\
        return jsonify(\{"error": f"\uc0\u19979 \u36617 \u22833 \u25943 \u65306 \{str(e)\}"\}), 500\
\
if __name__ == '__main__':\
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))}