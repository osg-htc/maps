import { Suspense } from 'react';
import ViewController from './ViewController';
import LoadingScreen from '../LoadingScreen'; 

export default function ProjectMap() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ViewController />
    </Suspense>
  );
}