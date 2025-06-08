/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatPrice } from '@/utils/formatprice';
import { MessageSquare, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import { Pagination } from 'antd';
import { useState } from 'react';

const OderList = ({ orderList }: any) => {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 5;

	const viewShop = (shopId: number) => {
		router.push(`/shop-infor/${shopId}`);
	};
	const handleProduct = (productId: number) => {
		router.push(`/productdetail/${productId}`);
	};

	const paginatedOrders = orderList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="space-y-4">
			{paginatedOrders.map((order: any, index: number) => (
				<div key={index} className="bg-white p-4 rounded-lg shadow">
					{/* Order Header */}
					<div className="flex justify-between items-center border-b pb-3 mb-3">
						<div className="flex items-center gap-3">
							<Store className="h-5 w-5 text-gray-600" />
							<span className="font-medium">
								{order.BillDetail[0].ProductVariant.Products.Shop.shopName}
							</span>
							<button className="flex items-center gap-1 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-200">
								<MessageSquare className="h-3 w-3" /> Chat
							</button>
							<button
								onClick={() => viewShop(order.BillDetail[0].ProductVariant.Products.Shop.shopId)}
								className="flex items-center gap-1 text-xs cursor-pointer border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
							>
								<Store className="h-3 w-3" /> View Shop
							</button>
						</div>
						<span className="text-sm text-gray-500">
							Ngày đặt hàng :{' '}
							{formatDistanceToNow(new Date(order.createAt), { addSuffix: true, locale: vi })}
						</span>
					</div>

					{order.BillDetail.map((item: any, index: number) => (
						<div key={index} className="flex gap-4 mb-3">
							<Image
								src={item.ProductVariant.img}
								alt={item.ProductVariant.Products.productName}
								width={80}
								height={80}
								className="w-20 h-20 object-cover rounded border"
							/>
							<div className="flex-1">
								<p className="font-medium mb-1">{item.ProductVariant.Products.productName}</p>
								<p className="text-sm text-gray-600">
									chi tiết sản phẩm: {item.ProductVariant.VariantValue.typeValue}
								</p>
								<p className="text-sm text-gray-600">số lượng : x{item.quantity}</p>
							</div>
							<div className="text-right">
								{item.totalPrice && (
									<span className="text-sm text-gray-500 line-through mr-2">
										{formatPrice(item.totalPrice)}
									</span>
								)}
								<span className="text-sm font-medium text-red-600 mb-1">
									{formatPrice(item.totalPrice)}
								</span>
							</div>
						</div>
					))}

					<p className="text-[16px] text-gray-500 mb-3">
						Hình thức thanh toán :{' '}
						<span
							className={`font-medium ${
								order.statusId === 6
									? 'text-blue-600'
									: order.statusId === 2
										? 'text-green-600'
										: 'text-red-600'
							}`}
						>
							{order.statusbill}
						</span>
					</p>

					{/* Order Footer */}
					<div className="flex justify-end items-center gap-4 border-t pt-3 mt-3">
						<div className="flex gap-2">
							<button
								onClick={() => handleProduct(order.BillDetail[0].ProductVariant.Products.productId)}
								className="bg-orange-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-orange-600 text-sm font-medium"
							>
								Mua lại
							</button>
							{order.statusId !== 5 && (
								<button
									onClick={() => handleProduct(order.BillDetail[0].ProductVariant.Products.productId)}
									className="border border-gray-300 px-4 cursor-pointer py-2 rounded hover:bg-gray-100 text-sm"
								>
									Đánh giá
								</button>
							)}
						</div>
					</div>
				</div>
			))}

			{/* Pagination */}
			<div className="flex justify-center mt-6">
				<Pagination
					current={currentPage}
					total={orderList.length}
					pageSize={pageSize}
					onChange={handlePageChange}
					showSizeChanger={false}
				/>
			</div>
		</div>
	);
};

export default OderList;
