import { Suspense } from 'react';
import ViewController from './ViewController';
import LoadingScreen from '../LoadingScreen'; 

export default function Map(props: any) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ViewController {...props} />
    </Suspense>
  );
}