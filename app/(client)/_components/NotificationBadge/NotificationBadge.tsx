'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { socket } from '../socket';
import { FaRegCommentDots } from 'react-icons/fa6';

const NotificationBadge = ({ currentUser }: { currentUser: string }) => {
    const [notifications, setNotifications] = useState<{ [sender: string]: number }>({});
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) return;

        const connectAndJoin = () => {
            if (!socket.connected) {
                socket.connect();
            }

            socket.emit('join', currentUser);

            socket.on('unread_messages', (data) => {
                // console.log('[SOCKET] unread_messages:', data); // debug log
                setNotifications(data);
            });
        };

        connectAndJoin();

        socket.onAny((event, ...args) => {
            // console.log('[Socket Event]', event, args);
        });


        return () => {
            socket.off('unread_messages');
        };
    }, [currentUser]);

    const unreadCount = Object.values(notifications).reduce((a, b) => a + b, 0);

    return (
        <div
            className="relative cursor-pointer"
            onClick={() => router.push('/dashboard/messages')}
        >
            <div className="relative">
                <FaRegCommentDots className="text-[26px] text-[#00BBA7]" /> {/* Message Icon */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </div>
            {/* <p>N</p>
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-sm flex items-center justify-center">
                    {unreadCount}
                </span>
            )} */}
        </div>
    );
};

export default NotificationBadge;
