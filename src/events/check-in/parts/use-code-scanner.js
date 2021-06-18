import React, { useEffect, useRef } from 'react';
import QrcodeDecoder from 'qrcode-decoder';

/**
 * This will only work on secure (https or localhost) hosts.
 *
 * @param {(data: any) => void} onScan Callback when scan finds data
 * @param {boolean} enabled Flag to enable/disable
 * @returns {React.MutableRefObject<HTMLVideoElement>}
 */
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
		})(); //.catch(alert)});

		return stop;
	}, [onScan, videoRef.current, enabled]);

	return videoRef;
}
