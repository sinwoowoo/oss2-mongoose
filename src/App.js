import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Display from './Display';
import { getUserAsync, selectUserDetails } from './features/user/userSlice';
import TopBar from './TopBar';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserAsync());
  }, [dispatch]);

  const userDetails = useSelector(selectUserDetails);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        {userDetails === ''
          ? <h4 className="p-4">Login to see todo items</h4>
          : <Display />
        }
      </main>
    </div>
  );
}

export default App;
