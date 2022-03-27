import { useEffect, useState } from 'react';
import { formatBytes } from './Utilities';
import './styles.css';

export default function App() {
	const [imgDataUrl, setImgDataUrl] = useState<string>();
	const [imgFile, setImgFile] = useState<File>();

	useEffect(() => {
		console.log(imgFile);
	}, [imgFile]);

	return (
		<div className="App">
			<h1>Acquire envelope photo</h1>
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
							const file = e.target.files![0];
							setImgFile(file);
							if (file) setImgDataUrl(URL.createObjectURL(file));
						}}
					/>
				</label>
			</div>
			{imgDataUrl && (
				<div className="container">
					<div className="row justify-content-center">
						<div className="col">
							<div className="card m-4">
								<img
									src={imgDataUrl}
									className="card-img-top"
									alt="envelope snapshot"
									onLoad={() =>
										URL.revokeObjectURL(imgDataUrl)
									}
								/>
								<div className="card-body">
									<h5 className="card-title">
										{imgFile?.name}
									</h5>
									<p className="card-text">
										Size:{' '}
										<mark className="p-1">
											{formatBytes(imgFile?.size!, 2)}
										</mark>
									</p>
									<p className="card-text">
										Type:{' '}
										<mark className="p-1">
											{imgFile?.type}
										</mark>
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
