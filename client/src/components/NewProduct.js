import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';
import Dropzone from 'react-dropzone';

export default ({
  uploading,
  image,
  changeImage,
  onImageDrop,
}) => {
  return (
    <div>
      <Card>
        <CardHeader>Personal details</CardHeader>
        <CardBody>
          {uploading ? (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <p>
                  <i className="fa fa-spinner fa-pulse fa-spin fa-5x" style={{ color: 'green' }} />
                </p>
              </div>
              <p style={{ textAlign: 'center', fontSize: 20 }}>Please wait...</p>
            </div>
          ) : image ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <div className="contain">
                <img
                  alt="logo"
                  src={image}
                  className="thumbnail image"
                  style={{ width: 'auto', height: 150 }}
                />
                {changeImage ? (
                  <div className="overlay" onClick={() => changeImage()}>
                    <div className="text">Change Image</div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
              <Dropzone
                multiple={false}
                accept="image/*"
                onDrop={onImageDrop ? onImageDrop : ''}
                name="logos"
              >
                <p
                  style={{
                    justifyContent: 'center',
                    textAlign: 'center',
                    margin: 10,
                    marginTop: 60,
                  }}
                >
                  Drop an image or click to select a file to upload.
                </p>
              </Dropzone>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};