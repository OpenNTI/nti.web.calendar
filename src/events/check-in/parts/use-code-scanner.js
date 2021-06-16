import { useEffect, useRef } from 'react';
import QrcodeDecoder from 'qrcode-decoder';

export function useCodeScanner(onScan, enabled = true) {
	const videoRef = useRef();
	useEffect(() => {
		const { current: video = document.createElement('video') } = videoRef;
		const qr = new QrcodeDecoder();

		if (
			!enabled ||
			typeof onScan !== 'function' ||
			!qr.isCanvasSupported()
		) {
			video.hidden = true;
			return;
		}

		video.autoplay = true;
		video.playsInline = true;

		function stop() {
			video.hidden = true;
			qr.stop();
		}

		(async () => {
			video.hidden = false;
			qr.videoConstraints.video = {
				facingMode: 'environment',
			};
			const data = await qr.decodeFromCamera(video);
			if (video.hidden) return;
			onScan(data);
			stop();
		})();

		return stop;
	}, [onScan, videoRef.current, enabled]);

	return videoRef;
}
