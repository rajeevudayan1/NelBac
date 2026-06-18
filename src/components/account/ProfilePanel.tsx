import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/auth';
import { ApiError } from '@/api/client';
import { labelClass, inputClass, primaryBtn } from './formStyles';

const ProfilePanel: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    setProfileErr(null);
    try {
      await authApi.updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });
      await refreshUser();
      setProfileMsg('Profile updated.');
    } catch (err) {
      setProfileErr(err instanceof ApiError ? err.message : 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    setPwErr(null);
    if (newPw !== confirmPw) {
      setPwErr('New passwords do not match.');
      return;
    }
    setSavingPw(true);
    try {
      await authApi.changePassword(oldPw, newPw);
      setPwMsg('Password changed.');
      setOldPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      setPwErr(err instanceof ApiError ? err.message : 'Could not change password.');
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Identity */}
      <section className="glass rounded-[2rem] p-8 border border-[var(--border-secondary)]">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-14 h-14 rounded-full bg-[#00f3ff] text-black flex items-center justify-center text-xl font-black">
            {(user?.full_name || user?.username || '?').charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-black text-[var(--text-primary)] text-lg">{user?.username}</p>
            <p className="text-[var(--text-secondary)] text-[12px] uppercase tracking-widest font-bold">
              {user?.role || 'Customer'}{user?.is_verified ? '' : ' · Email not verified'}
            </p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="space-y-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            </div>
          </div>
          {profileErr && <p className="text-[11px] font-bold text-red-400">{profileErr}</p>}
          {profileMsg && <p className="text-[11px] font-bold text-emerald-400">{profileMsg}</p>}
          <button type="submit" disabled={savingProfile} className={primaryBtn}>
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="glass rounded-[2rem] p-8 border border-[var(--border-secondary)]">
        <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[var(--text-primary)] mb-6">
          <i className="fas fa-lock text-[var(--accent-solid)] mr-3"></i>Change Password
        </h3>
        <form onSubmit={changePassword} className="space-y-5">
          <div>
            <label className={labelClass}>Current Password</label>
            <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} required className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>New Password</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} required minLength={8} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Confirm New</label>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required minLength={8} className={inputClass} />
            </div>
          </div>
          {pwErr && <p className="text-[11px] font-bold text-red-400">{pwErr}</p>}
          {pwMsg && <p className="text-[11px] font-bold text-emerald-400">{pwMsg}</p>}
          <button type="submit" disabled={savingPw} className={primaryBtn}>
            {savingPw ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePanel;
