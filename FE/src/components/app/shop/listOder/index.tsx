/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatPrice } from '@/utils/formatprice';
import { Truck, Package } from 'lucide-react';
import ShopServicer from '@/services/shopServicer/shopServicer';
import { URL_SERVICE } from '@/constant/constant';
import { Button, Tag, Pagination } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import PrintBill from '@/components/app/bills/PrintBill';
import { PDFDownloadLink } from '@react-pdf/renderer';
type OrderListProps = {
	orderList: any[];
	onStatusChange: (newStatusId: number) => void;
};

interface StatusOrder {
	statusId: number;
	statusName: string;
}

const ListOrder = ({ orderList, onStatusChange }: OrderListProps) => {
	const [dataStatus, setDataStatus] = useState<StatusOrder[]>([]);
	const shopServices = new ShopServicer(URL_SERVICE, () => {});
	const [activeStatusId, setActiveStatusId] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 5;

	const fetchSTatusOrder = async () => {
		try {
			const response: any = await shopServices.getStatusOder();

			setDataStatus(response.data);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		fetchSTatusOrder();
	}, []);

	const getStatusStyles = (statusId: number) => {
		switch (statusId) {
			case 1:
				return 'text-yellow-600';
			case 2:
				return 'text-blue-600';
			case 3:
				return 'text-purple-600';
			case 4:
				return 'text-green-600';
			case 5:
				return 'text-red-600';
			case 6:
				return 'text-orange-600';
			default:
				return 'text-gray-600';
		}
	};

	const getStatusTag = (statusId: number, statusName: string) => {
		const statusMap: { [key: number]: { color: string } } = {
			1: { color: 'gold' },
			2: { color: 'blue' },
			3: { color: 'purple' },
			4: { color: 'green' },
			5: { color: 'red' },
			6: { color: 'orange' },
		};

		const statusInfo = statusMap[statusId] || { color: 'default' };
		return <Tag color={statusInfo.color}>{statusName}</Tag>;
	};

	const getCurrentPageOrders = () => {
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		return orderList?.slice(startIndex, endIndex) || [];
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="space-y-4">
			<div className="cursor-pointer bg-white w-full flex flex-row overflow-hidden">
				{dataStatus.map((item: any) => (
					<div
						key={item.statusId}
						onClick={() => {
							setActiveStatusId(item.statusId);
							onStatusChange(item.statusId);
							setCurrentPage(1);
						}}
						className={`w-[16.6667%] py-3 text-center text-[14px] 
						${activeStatusId === item.statusId ? 'text-[#0d5cb6] border-b-2 border-[#0d5cb6]' : 'text-[#808089] border-b-0'}`}
					>
						{item.statusName}
					</div>
				))}
			</div>
			{orderList && orderList.length > 0 ? (
				<>
					{getCurrentPageOrders().map((order) => (
						<div key={order.billId} className="bg-white p-4 rounded-lg shadow">
							<div className="flex justify-between items-center border-b pb-3 mb-3">
								<div className="flex items-center gap-3">
									<Package className="h-5 w-5 text-gray-600" />
									<span className="font-medium">Đơn hàng #{order.billId}</span>
									{/* <span className="text-sm text-gray-500">
										{new Date(order.createdAt).toLocaleDateString('vi-VN')}
									</span> */}
									<div
										className={`flex items-center gap-2 text-sm font-medium ${getStatusStyles(order.statusId)}`}
									>
										{order.deliveryStatus && <Truck className="h-4 w-4" />}
										{order.deliveryStatus}
										{order.deliveryStatus && order.statusId && (
											<span className="text-gray-300">|</span>
										)}
										{getStatusTag(order.statusId, order.statusName)}
									</div>
								</div>
							</div>

							{order.BillDetail.map((item: any, index: number) => (
								<div key={index} className="flex gap-4 mb-3">
									<Image
										src={item.ProductVariant.img}
										alt={item.ProductVariant.img}
										width={80}
										height={80}
										className="w-20 h-20 object-cover rounded border"
									/>
									<div className="w-[20%]">
										<p className="font-medium mb-1">{item.ProductVariant.Products.productName}</p>
										<p className="text-sm text-gray-600">
											Phân loại: {item.ProductVariant.VariantValue.typeValue}
										</p>
										<p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
									</div>
									<div className="border-b pb-3 mb-3 flex-1">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<h4 className="font-medium mb-2">Thông tin khách hàng</h4>
												<p className="text-sm text-gray-600">
													Họ và Tên: {order.Customer?.customerName || 'Giấu tên'}
												</p>
												<p className="text-sm text-gray-600">
													SĐT: {order.Customer?.numberPhone || 'N/A'}
												</p>
												<p className="text-sm text-gray-600">
													Email: {order.Customer?.email || 'N/A'}
												</p>
											</div>
											<div>
												<h4 className="font-medium mb-2">Địa chỉ giao hàng</h4>
												<p className="text-sm text-gray-600">{order.address || 'N/A'}</p>
											</div>
										</div>
									</div>
									<div className="text-right">
										{item.totalPrice && (
											<span className="text-sm text-gray-500 line-through mr-2">
												{formatPrice(item.totalPrice)}
											</span>
										)}
										<span className="text-sm font-medium text-red-600">
											{formatPrice(item.totalPrice)}
										</span>
									</div>
								</div>
							))}

							<div className="flex justify-between items-center border-t pt-3 mt-3">
								<div className="flex gap-2">
									<Button>
										<PDFDownloadLink
											document={<PrintBill dataBill={order} />}
											fileName="invoice.pdf"
										>
											{({ loading }) => (loading ? 'Đang tạo PDF...' : 'Tải hóa đơn PDF')}
										</PDFDownloadLink>
									</Button>
								</div>
								<div className="text-right">
									Tổng tiền:{' '}
									<span className="text-lg font-medium text-red-600">
										{formatPrice(
											order.BillDetail.reduce(
												(sum: number, item: any) => sum + (item.totalPrice || 0),
												0,
											),
										)}
									</span>
								</div>
							</div>
						</div>
					))}
					<div className="flex justify-center mt-4">
						<Pagination
							current={currentPage}
							pageSize={pageSize}
							total={orderList.length}
							onChange={handlePageChange}
							showSizeChanger={false}
						/>
					</div>
				</>
			) : (
				<div className="">
					<div className="flex flex-col items-center bg-white w-full p-[35px]">
						<img
							src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
							alt="Empty Order"
							className="w-[200px] h-[200px]"
						/>
						<p className="mt-[15px] text-[#38383d] text-base font-normal">Chưa có đơn hàng</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ListOrder;
