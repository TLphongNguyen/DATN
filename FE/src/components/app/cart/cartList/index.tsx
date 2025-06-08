/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Checkbox, CheckboxProps } from 'antd';
import { FaRegTrashCan } from 'react-icons/fa6';
import CartItem from './cartItem';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { formatPrice } from '@/utils/formatprice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { SelectedItems } from '@/reducers/slice/checkout';
type CartItemType = {
	id: number;
	name: string;
	quantity: number;
	price: number;
	img: string;
	cartId: number;
	variantValue: string;
	totalPrice: number;
	isSelected: boolean;
};
const CartList = () => {
	const dispatch = useDispatch();
	const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);
	const cart = useSelector((state: RootState) => state.cart.cart);
	console.log(cart);

	const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;
	const router = useRouter();

	const handleSelectAll: CheckboxProps['onChange'] = (e) => {
		if (e.target.checked) {
			const allSelected = cart.map((item: any) => ({
				id: item.id,
				name: item.productName,
				quantity: item.quantity,
				price: item.price,
				cartId: item.cartId,
				img: item.image,
				variantValue: item.typeValue,
				totalPrice: item.quantity * item.price,
				isSelected: true,
			}));
			setSelectedItems(allSelected);
		} else {
			setSelectedItems([]);
		}
	};

	const handleSelect = (item: CartItemType) => {
		setSelectedItems((prev) => {
			const index = prev.findIndex((i) => i.id === item.id);
			if (item.isSelected) {
				if (index !== -1) {
					const newList = [...prev];
					newList[index] = item;
					return newList;
				} else {
					return [...prev, item];
				}
			} else {
				return prev.filter((i) => i.id !== item.id);
			}
		});
	};

	const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
	const handleBuy = () => {
		dispatch(SelectedItems(selectedItems));
		router.push('/checkout');
	};
	return (
		<div className="w-full flex">
			<div className="flex-1 w-[(calc(100% - 380px))] mr-5">
				<header className="bg-white grid  py-2 px-4 text-[#242424] gap-x-6 grid-cols-[auto_180px_120px_120px_20px] rounded-[4px] text-[13px] mb-3 sticky top-[20px] z-50 items-center">
					<div className="">
						<Checkbox onChange={handleSelectAll} checked={isAllSelected}>
							<span>{`Tất cả (${cart.length} sản phẩm)`}</span>
						</Checkbox>
					</div>
					<span className="">Đơn giá</span>
					<span className="">Số lượng</span>
					<span className="">Thành tiền</span>
					<button>
						<FaRegTrashCan />
					</button>
				</header>
				<div className="">
					{cart.length > 0 ? (
						cart?.map((item: any, index: number) => (
							<CartItem
								key={index}
								id={item.id}
								cartId={item.cartId}
								img={item.ProductVariant.img}
								name={item.productName}
								quantities={item.quantity}
								price={item.ProductVariant.price}
								variantValue={item.typeValue}
								productId={item.productId}
								onSelect={handleSelect}
								isSelected={selectedItems.some((selected) => selected.id === item.id)}
							/>
						))
					) : (
						<div>
							<div className="flex flex-col items-center bg-white w-full p-[35px]">
								<img
									src="https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png"
									alt="Empty Order"
									className="w-[200px] h-[200px]"
								/>
								<p className="mt-[15px] text-[#38383d] text-base font-normal">
									Chưa có sản phẩm trong giỏ hàng
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="w-[340px] bg-white p-4 rounded-sm">
				<div className="border-b border-[#dcdcdc] pb-4">
					<div className="text-[#808089] text-[14px] mb-4">Tiki Khuyến Mãi</div>
					<div className="flex items-center gap-2 text-[#0b74e5] text-[13px] cursor-pointer">
						<span>Giảm 34k cho đơn từ 0đ</span>
						<span className="ml-auto">{'>'}</span>
					</div>
				</div>

				<div className="py-4 border-b border-[#dcdcdc]">
					<div className="flex justify-between mb-3">
						<span className="text-[#38383d] text-[14px]">Tạm tính</span>
						<span className="text-[14px]">{formatPrice(totalPrice)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-[#38383d] text-[14px]">Giảm giá</span>
						<span className="text-[14px]">{formatPrice(totalPrice)}</span>
					</div>
				</div>

				<div className="pt-4">
					<div className="flex justify-between mb-3">
						<span className="text-[#38383d] text-[14px]">Tổng tiền thanh toán</span>
						<div className="text-right">
							<div className="text-[#ff424e] text-[20px] font-medium">
								{totalQuantity > 0 ? `${formatPrice(totalPrice)}` : 'Vui lòng chọn sản phẩm'}
							</div>

							<div className="text-[#808089] text-[12px]">(Đã bao gồm VAT nếu có)</div>
						</div>
					</div>
					<button
						disabled={totalQuantity === 0}
						onClick={handleBuy}
						className="w-full bg-[#ff424e] cursor-pointer text-white py-3 rounded-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Mua Hàng ({selectedItems.length})
					</button>
				</div>
			</div>
		</div>
	);
};
export default CartList;
