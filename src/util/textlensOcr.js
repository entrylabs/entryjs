
const TEXTLENS_API =
    'https://textlens-ocr-api.onrender.com/api/ocr';

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_TYPES = [
    'image/png',
    'image/jpeg',
    'image/webp',
];

export async function recognizeText(image) {
    if (!(image instanceof Blob)) {
        throw new Error('이미지 파일이 필요합니다.');
    }

    if (!ALLOWED_TYPES.includes(image.type)) {
        throw new Error('PNG, JPG, WEBP 이미지만 지원합니다.');
    }

    if (image.size > MAX_FILE_SIZE) {
        throw new Error('이미지 크기는 8MB 이하여야 합니다.');
    }

    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch(TEXTLENS_API, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error || `OCR 서버 오류: ${response.status}`
        );
    }

    return {
        text: result.text,
        confidence: result.confidence,
    };
}
