/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ShopServicer from '@/services/shopServicer/shopServicer';
import { URL_SERVICE, URL_SOCKET } from '@/constant/constant';
import ListOrder from '@/components/app/shop/listOder';

import io from 'socket.io-client';
const socket = io(URL_SOCKET);

const OrdersPage = () => {
	const [orders, setOrders] = useState<any[]>([]);
	const shop = useSelector((state: RootState) => state.shop.shopInfo);
	const shopServices = new ShopServicer(URL_SERVICE, () => {});

	const fetchOrders = async () => {
		try {
			const response = await shopServices.getOrderListByShopId(shop?.shopId);
			setOrders(response.data);
		} catch (error) {
			console.error('Error fetching orders:', error);
		}
	};

	const fetchOrdersByStatus = async (statusId: number) => {
		try {
			const data = {
				status: statusId,
				shopId: shop?.shopId,
			};
			const response = await shopServices.getOderbyStatus(data);
			setOrders(response.data);
		} catch (error) {
			console.error('Error fetching orders by status:', error);
		}
	};

	useEffect(() => {
		if (shop?.shopId) {
			fetchOrders();
		}
	}, [shop?.shopId]);

	useEffect(() => {
		if (shop?.shopId) {
			socket.emit('shop_join', shop.shopId);
		}

		socket.on('receivePayment', (data: any) => {
			console.log(data);
			setOrders((prev) => [data, ...prev]);
		});

		return () => {
			socket.disconnect();
			socket.off('receivePayment');
		};
	}, [socket]);

	const handleStatusChange = (newStatusId: number) => {
		if (newStatusId) {
			fetchOrdersByStatus(newStatusId);
		} else {
			fetchOrders();
		}
	};

	return (
		<div className="max-w-7xl mx-auto p-6 min-h-[80vh] overflow-y-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold mb-4">Quản lý đơn hàng</h1>

				{/* Order List */}
				<ListOrder orderList={orders} onStatusChange={handleStatusChange} />
			</div>
		</div>
	);
};

export default OrdersPage;
