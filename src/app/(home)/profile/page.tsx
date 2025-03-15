/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import UpdateButton from '@/components/UpdateButton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/lib/redux/features/user/useUser';
const ProfilePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user, loading, error, fetchUser, updateUserData, setUserState } = useUsers();

  useEffect(() => {
    if (session?.user?.id) {
      fetchUser(session.user.id);
    }
  }, [session?.user?.id]);

  if (loading) return <p>Loading...</p>;
if (error) return <p> Có lỗi xảy ra</p>;
  if (!user) return <p>No user data found.</p>;

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      const imageUrl = data.filePath;

      if (imageUrl) {
        setUserState({
          ...user,
          imageUrl: imageUrl,
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!user) return;
    try {
      if (session?.user?.id) {
        updateUserData(session.user.id, user);
      } else {
        console.error('Session or user ID is missing');
      }
      alert('✅ Cập nhật thành công!');
      router.refresh();
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật:', error);
    }
  };

  const combinedAddress =
    user?.addressList && user.addressList.length > 0
      ? user.addressList
          .map(
            (addr) =>
              `${addr?.street || ''}, ${addr?.city || ''}, ${addr?.state || ''}, ${
                addr?.zipCode || ''
              }`,
          )
          .join(' | ')
      : '';

  // const handleUpdateUser = async () => {
  //   if (!user) {
  //     console.error('❌ Không có dữ liệu user!');
  //     return;
  //   }

  //   // // const userData = {
  //   // //   firstName: user?.firstName || '',
  //   // //   lastName: user?.lastName || '',
  //   // //   phoneNumber: user?.phoneNumber || '',
  //   // //   imageUrl: user?.image || '',
  //   // // };

  //   // try {
  //   //   await updateUser(id, userData);
  //   //   alert('✅ Cập nhật thành công!');
  //   //   router.refresh();
  //   // } catch (error) {
  //   //   console.error('❌ Lỗi khi cập nhật:', error);
  //   }
  // };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <form className="space-y-4" action={handleUpdateUser}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3 text-center relative">
                <Image
                  src={user?.imageUrl || '/default-avatar.png'}
                  alt="User Avatar"
                  width={120}
                  height={120}
                  unoptimized={!user?.imageUrl}
                  className="rounded-full mx-auto"
                />
                <div className="mt-3">
                  <label className="cursor-pointer bg-black text-white px-3 py-2 rounded-md text-sm inline-flex items-center">
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      'Upload Ảnh'
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadAvatar}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-lg font-semibold border-b pb-2 mb-4">User Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        className="w-full border rounded-md p-2"
                        value={user?.firstName || ''}
                        disabled={!isEditing}
                        onChange={(e) => setUserState({ ...user, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        className="w-full border rounded-md p-2"
                        value={user?.lastName || ''}
                        disabled={!isEditing}
                        onChange={(e) => setUserState({ ...user, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full border rounded-md p-2"
                        value={user?.email || ''}
                        disabled
                        onChange={(e) => setUserState({ ...user, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        className="w-full border rounded-md p-2"
                        value={user?.phoneNumber || ''}
                        disabled={!isEditing}
                        onChange={(e) => setUserState({ ...user, phoneNumber: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-gray-600">Address</label>
                      <input
                        type="text"
                        name="address"
                        className="w-full border rounded-md p-2"
                        value={combinedAddress || ''}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setUserState({
                            ...user,
                            addressList: [
                              {
                                id: user.addressList[0]?.id || '',
                                name: user.addressList[0]?.name || '',
                                street: e.target.value,
                                city: user.addressList[0]?.city || '',
                                state: user.addressList[0]?.state || '',
                                zipCode: user.addressList[0]?.zipCode || '',
                                phoneNumber: user.addressList[0]?.phoneNumber || '',
                              },
                            ],
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    {isEditing ? (
                      <UpdateButton />
                    ) : (
                      <Button
                        type="button"
                        className="px-4 py-2 rounded-md"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
