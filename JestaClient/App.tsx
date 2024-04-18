import React from 'react';
import { AuthProvider } from './src/AuthContext';
import Main from './Main';

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Main></Main>
    </AuthProvider>
  );
}

export default App