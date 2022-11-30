import { storage } from '../../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { RandomIDTag } from '../Helpers/RandomIdTag';

/**
 *
 * @param {filelist} loadedFileList - file list from input[type='file']
 * @param {function} setIsLoading - function from useState Hook for changing Loading status
 * @param {function} setCurrentFileList - function from useState Hook for changing Current Filelist status
 */
export function LoadingFiles(loadedFileList, setIsLoading, setCurrentFileList) {
  // uploading files on server
  for (let index = 0; index < loadedFileList.length; index++) {
    // choose file by file to upload
    const file = loadedFileList[index];

    // create storage reference
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadFile = uploadBytesResumable(storageRef, file);

    // upload files (changing state)
    uploadFile.on(
      'state_changed',
      (snapshot) => {
        setIsLoading(true);
      },
      (error) => {
        alert(error);
      },

      () => {
        getDownloadURL(uploadFile.snapshot.ref).then((url) => {
          setCurrentFileList((prevList) => {
            return [
              ...prevList,
              {
                key: `file_${RandomIDTag()}`,
                name: uploadFile.snapshot.metadata.name,
                fullPath: uploadFile.snapshot.metadata.fullPath,
                url: url,
              },
            ];
          });
          // hide loading process when files are loaded
          if (index === loadedFileList.length - 1) {
            setIsLoading(false);
          }
        });
      }
    );
  }
}
