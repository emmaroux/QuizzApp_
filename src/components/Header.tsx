import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserRoles } from '../hooks/useUserRoles';
import { LogIn, LogOut, User, Shield } from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRoles(user?.id);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Quiz App</h1>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <LogIn className="w-4 h-4" />
              Connexion
            </button>
          )}
        </div>
      </div>
    </header>
  );
};