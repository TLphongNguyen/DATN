/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect, useRef } from 'react';
import { FiSend, FiMoreVertical } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ServicesChat from '@/services/chat/servicesChat';
import { URL_SERVICE, URL_SOCKET } from '@/constant/constant';
import useDebounce from '@/utils/useDebounce';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { Ichat } from '@/models/chat/Ichat';
import io from 'socket.io-client';
const socket = io(URL_SOCKET);

export default function ChatPage() {
	const { register, handleSubmit, reset } = useForm<any>();

	const [customers, setCustomers] = useState<any>([]);
	const [loading, setLoading] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState<any>(customers[0]);
	const [activeCustomer, setActiveCustomer] = useState<string>('');
	const containerRef = useRef<HTMLDivElement>(null);
	const [chats, setChats] = useState<Ichat[]>([]);

	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 1000);
	const servicesChat = new ServicesChat(URL_SERVICE || '', () => {});
	const shop = useSelector((state: RootState) => state.shop.shopInfo);

	useEffect(() => {
		if (selectedCustomer?.customerId && shop?.shopId) {
			if (selectedCustomer.customerId) {
				socket.emit('leave_chat', {
					customerId: selectedCustomer.customerId,
					shopId: shop.shopId,
				});
			}

			// Join new room
			socket.emit('join_chat', {
				customerId: selectedCustomer.customerId,
				shopId: shop.shopId,
			});
		}
	}, [selectedCustomer, shop]);

	useEffect(() => {
		const fetchData = async () => {
			if (debouncedSearchTerm.trim()) {
				setLoading(true);

				const delayTimer = setTimeout(async () => {
					try {
						const response: any = await servicesChat.searchCustomer(debouncedSearchTerm);
						setCustomers(response.data);
					} catch (error) {
						console.log(error);
					} finally {
						setLoading(false);
					}
				}, 500);

				return () => clearTimeout(delayTimer);
			}
		};

		fetchData();
	}, [debouncedSearchTerm]);

	useEffect(() => {
		const fetchDataCustomer = async () => {
			try {
				const response = await servicesChat.getCustomerChattedWithShop(shop?.shopId);
				setCustomers(response.data);
			} catch (error) {
				console.error('Error fetching customers:', error);
			}
		};
		fetchDataCustomer();
	}, [socket]);
	const scrollToBottom = () => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		} else {
			console.log('Container ref is null');
		}
	};

	const onSubmit = async (data: any) => {
		if (!data.message.trim()) return;
		if (selectedCustomer.customerId && shop.shopId) {
			const datasend = {
				customerId: selectedCustomer.customerId,
				shopId: shop.shopId,
				content: data.message,
				senderId: shop.shopId,
				senderType: 'SHOP',
			};

			try {
				const response = await servicesChat.createChat(datasend);
				socket.emit('sendMessage', {
					content: data.message,
					senderType: 'SHOP',
					customerId: selectedCustomer.customerId,
					shopId: shop.shopId,
					createdAt: response.data.createdAt,
				});
			} catch (error) {
				console.log(error);
			}
		}
		reset();
	};

	useEffect(() => {
		socket.on('receiveMessage', (data: any) => {
			setChats((prev) => [...prev, data]);
			scrollToBottom();
		});

		return () => {
			socket.off('receiveMessage');
		};
	}, [socket]);

	const handleChat = (customer: any) => {
		setActiveCustomer(customer.customerId);
		if (customer.customerId && shop.shopId) {
			setSelectedCustomer(customer);
			const fetchChats = async () => {
				try {
					const response = await servicesChat.getShopMessages(customer.customerId, shop.shopId);
					setChats(response.data);
				} catch (error) {
					console.log(error);
				}
			};
			fetchChats();
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [chats]);

	// Cleanup when component unmounts
	useEffect(() => {
		return () => {
			if (selectedCustomer?.customerId && shop?.shopId) {
				socket.emit('leave_chat', {
					customerId: selectedCustomer.customerId,
					shopId: shop.shopId,
				});
			}
		};
	}, [selectedCustomer, shop]);

	return (
		<div className="flex h-[85vh] container-base mt-10 bg-gray-50">
			{/* Sidebar */}
			<aside className="w-1/4 border-r bg-white p-4">
				<h2 className="text-xl font-semibold mb-4">Chats</h2>
				<Input onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="mb-4" />
				<ul className="space-y-3 overflow-auto h-[85%] pr-2">
					{loading ? (
						<div className="p-3 text-sm text-gray-500">Đang tìm kiếm...</div>
					) : customers.length === 0 ? (
						<div className="p-3 text-sm text-gray-500">Không tìm thấy kết quả</div>
					) : (
						customers.map((c: any, i: number) => (
							<li
								onClick={() => handleChat(c)}
								key={i}
								className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
									activeCustomer === c.customerId ? 'bg-gray-200' : ''
								}`}
							>
								<img
									src={c.avatar}
									alt={c.customerName}
									className="w-10 h-10 rounded-full object-cover"
								/>
								<div>
									<p className="font-medium text-sm">{c.customerName}</p>
								</div>
							</li>
						))
					)}
				</ul>
			</aside>

			{/* Chat Window */}
			<main className="flex-1 flex flex-col">
				{selectedCustomer && (
					<div ref={containerRef} className="flex items-center justify-between border-b px-6 py-4 bg-white">
						<div className="flex items-center space-x-3">
							<img
								src={selectedCustomer.avatar}
								alt={selectedCustomer.customerName}
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div>
								<h3 className="font-medium">{selectedCustomer.customerName}</h3>
								<span className="text-xs text-green-500">● Online</span>
							</div>
						</div>
						<div className="flex items-center gap-4 text-gray-600">
							<FiMoreVertical className="w-5 h-5 cursor-pointer" />
						</div>
					</div>
				)}

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
					{chats.length === 0 ? (
						<p className="text-center text-gray-400">
							Chưa có tin nhắn với {selectedCustomer?.customerName}
						</p>
					) : (
						chats.map((msg: any, i: number) => (
							<div
								key={i}
								className={`flex ${msg.senderType === 'SHOP' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
										msg.senderType === 'SHOP'
											? 'bg-blue-500 text-white'
											: 'bg-gray-200 text-gray-900'
									}`}
								>
									<p>{msg.content}</p>
									<p
										className={`text-[8px] leading-[8px] mt-1 ${
											msg.senderType === 'SHOP' ? 'text-white' : 'text-gray-600'
										}`}
									>
										{formatDistanceToNow(new Date(msg.createdAt), {
											addSuffix: true,
											locale: vi,
										})}
									</p>
								</div>
							</div>
						))
					)}
				</div>

				{/* Message Input */}
				<form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t bg-white flex items-center gap-2">
					<Input placeholder="Type a message" {...register('message')} className="flex-1" />
					<Button type="submit" className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white">
						<FiSend className="w-5 h-5" />
					</Button>
				</form>
			</main>
		</div>
	);
}
