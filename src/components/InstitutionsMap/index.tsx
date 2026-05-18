import Sidebar from '../Sidebar/';
import ViewController from './ViewController';

export default function Map() {
  return (
    <Sidebar body={
      <ViewController></ViewController>
    } />
  );
}