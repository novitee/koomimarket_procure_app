import React from 'react';
import {useGlobalStore} from 'stores/global';

export default function UploadProgress({
  filename,
  children,
}: {
  filename: string;
  children: ({progress}: {progress?: number}) => void;
}) {
  const {uploadProgress} = useGlobalStore();
  const progress = uploadProgress?.[filename];

  return <>{children({progress: progress})}</>;
}
