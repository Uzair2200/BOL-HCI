import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MicProvider } from './context/MicContext';

export default function App() {
  return (
    <MicProvider>
      <RouterProvider router={router} />
    </MicProvider>
  );
}
