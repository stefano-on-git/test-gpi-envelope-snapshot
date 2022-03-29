import { useEffect, useState } from 'react';
import ImageResize from 'image-resize';
import { formatBytes } from './Utilities';
import './styles.css';

export default function App() {
	const [imgFile, setImgFile] = useState<File>();
	const [imgDataUrlResized, setImgDataUrlResized] = useState<string>();

	useEffect(() => {
		if (imgFile) {
			console.log('Original img file: ', imgFile);
			const resize = async () => {
				const resizedImg = await new ImageResize({
					format: 'jpg',
					width: 800,
					quality: 0.8
				}).play(imgFile);
				console.log(resizedImg);
				setImgDataUrlResized(resizedImg);
			};
			resize();
		}
	}, [imgFile]);

	return (
		<div className="App">
			<h1>
				GPI
				<br />
				Acquire envelope snapshot
			</h1>
			<div className="d-grid gap-2 mx-auto col-6">
				<label className="btn btn-secondary btn-lg">
					<i className="fa fa-image"></i> Acquire
					<input
						type="file"
						style={{ display: 'none' }}
						name="image"
						accept="image/*"
						capture
						onChange={(e) => {
							setImgFile(e.target.files![0]);
						}}
					/>
				</label>
			</div>
			{imgFile && (
				<div className="container">
					<div className="row justify-content-center">
						<div className="col">
							<div className="card m-4">
								<img
									src={imgDataUrlResized}
									className="card-img-top"
									alt="envelope snapshot"
								/>
								<div className="card-body">
									<h5 className="card-title">
										{imgFile?.name}
									</h5>
									<p
										className="card-text"
										style={{ lineHeight: '250%' }}
									>
										Size:&nbsp;
										<mark className="p-1">
											{formatBytes(imgFile?.size!, 2)}
										</mark>
										<br />
										Type:&nbsp;
										<mark className="p-1">
											{imgFile?.type}
										</mark>
										<br />
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
