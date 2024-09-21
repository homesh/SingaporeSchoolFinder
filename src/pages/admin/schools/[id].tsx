const [file, setFile] = useState<File | null>(null);
const [uploadStatus, setUploadStatus] = useState<string>('');

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    setFile(event.target.files[0]);
  }
};

const handleUpload = async () => {
  if (!file) {
    setUploadStatus('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setUploadStatus('File uploaded successfully');
      // Update school data with the new file URL
      setSchoolData({ ...schoolData, attachments: [...schoolData.attachments, data.fileUrl] });
    } else {
      setUploadStatus('File upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    setUploadStatus('An error occurred during upload');
  }
};

// Add this to your JSX
<div>
  <input type="file" onChange={handleFileChange} />
  <button onClick={handleUpload}>Upload</button>
  {uploadStatus && <p>{uploadStatus}</p>}
</div>
