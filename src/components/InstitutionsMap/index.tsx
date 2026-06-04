import { Suspense } from 'react';
import ViewController from './ViewController';
import LoadingScreen from '../LoadingScreen';

export default function InstitutionsMap() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ViewController></ViewController>
    </Suspense>
  );
}