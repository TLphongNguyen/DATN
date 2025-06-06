/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { IoMdSend } from 'react-icons/io';
import { FaRegFaceSmile } from 'react-icons/fa6';
import AiServices from '@/services/AiServices/AiServices';
import { URL_SERVICE } from '@/constant/constant';
import ReactMarkdown from 'react-markdown';

interface Message {
	id: number;
	text: string;
	isAI: boolean;
	isHuman?: boolean;
}
type Props = {
	handleClose: () => void;
};
const ChatwithAI = ({ handleClose }: Props) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const aiServices = new AiServices(URL_SERVICE, () => {});
	const LoadingDots = () => {
		return (
			<div className="flex space-x-2 p-2">
				<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
				<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
				<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
			</div>
		);
	};
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const formatMessage = (text: string) => {
		return (
			<ReactMarkdown
				components={{
					a: ({ node, ...props }) => (
						<a
							{...props}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 underline hover:text-blue-700"
						/>
					),
				}}
			>
				{text}
			</ReactMarkdown>
		);
	};

	const handleSendMessage = async () => {
		if (!inputMessage.trim()) return;

		const newUserMessage: Message = {
			id: Date.now(),
			text: inputMessage,
			isAI: false,
		};

		setMessages((prev) => [...prev, newUserMessage]);
		const currentInput = inputMessage;
		setInputMessage('');
		setIsLoading(true);

		try {
			const response: any = await aiServices.chat(currentInput);
			const aiText = response.reply;
			console.log(aiText);
			if (aiText) {
				const newAiMessage: Message = {
					id: Date.now() + 1,
					text: aiText.response,
					isAI: true,
				};
				setMessages((prev) => [...prev, newAiMessage]);
			} else {
				console.error('Could not extract AI response from:', response);
				const errorAiMessage: Message = {
					id: Date.now() + 1,
					text: 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn.',
					isAI: true,
				};
				setMessages((prev) => [...prev, errorAiMessage]);
			}
		} catch (error) {
			console.error('Error calling AI service:', error);
			const errorAiMessage: Message = {
				id: Date.now() + 1,
				text: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
				isAI: true,
			};
			setMessages((prev) => [...prev, errorAiMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSendMessage();
		}
	};
	return (
		<div className="bg-white rounded-lg shadow-lg w-[700px] h-[700px] flex flex-col">
			<div className="p-4 border-b flex justify-between items-center">
				<h3 className="font-medium">Trợ lý AI</h3>
				<button className="cursor-pointer" onClick={handleClose}>
					<IoClose size={24} />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-4">
				{messages.map((message, index: number) => (
					<div key={index} className={`flex mb-4 ${message.isAI ? '' : 'justify-end'}`}>
						{message.isAI && (
							<div className="w-8 h-8 rounded-full bg-blue-100 mr-2 flex-shrink-0">
								<img
									src={
										'https://jpesrdrgrcqjeqavqxrj.supabase.co/storage/v1/object/public/tikistogare/img/a2b2c31ea7b0ad4b2e7d0e6ef817241b.png'
									}
									alt="Avatar"
									className="w-full h-full"
								/>
							</div>
						)}
						<div
							className={`max-w-[70%] p-3 rounded-lg ${
								message.isAI ? 'bg-gray-100' : 'bg-blue-500 text-white'
							}`}
						>
							{formatMessage(message.text)}
						</div>
					</div>
				))}
				{isLoading && (
					<div className="flex mb-4">
						<div className="w-8 h-8 rounded-full bg-blue-100 mr-2 flex-shrink-0">
							<img
								src={
									'https://jpesrdrgrcqjeqavqxrj.supabase.co/storage/v1/object/public/tikistogare/img/a2b2c31ea7b0ad4b2e7d0e6ef817241b.png'
								}
								alt="Avatar"
								className="w-full h-full"
							/>
						</div>
						<div className="bg-gray-100 rounded-lg">
							<LoadingDots />
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="p-4 border-t">
				<div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
					<FaRegFaceSmile className="text-gray-500 text-xl" />
					<input
						type="text"
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Nhập nội dung chat"
						className="flex-1 bg-transparent outline-none"
					/>
					<button onClick={handleSendMessage} className="text-blue-500 cursor-pointer">
						<IoMdSend size={20} />
					</button>
				</div>
				<div className="text-center text-xs text-gray-500 mt-2">
					Tích hợp trí tuệ nhân tạo, thông tin mang tính tham khảo
				</div>
			</div>
		</div>
	);
};
export default ChatwithAI;
