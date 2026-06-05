import { Suspense } from 'react';
import LoadingScreen from '../LoadingScreen';
import ViewController from './ViewController';

export default function InstitutionsMap() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ViewController></ViewController>
    </Suspense>
  );
}