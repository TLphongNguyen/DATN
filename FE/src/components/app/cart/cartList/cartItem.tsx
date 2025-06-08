/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Checkbox, CheckboxProps, Popconfirm, message } from 'antd';
import { FaRegTrashCan } from 'react-icons/fa6';
import { formatPrice } from '@/utils/formatprice';
import { deleteCart } from '@/reducers/slice/cartSlice';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import CartServices from '@/services/CartServices/CartServices';
import { URL_SERVICE } from '@/constant/constant';

type Props = {
	id: number;
	img: string;
	name: string;
	quantities: number;
	price: number;
	variantValue: string;
	cartId: number;
	productId: number;
	isSelected: boolean;
	onSelect?: (item: {
		id: number;
		name: string;
		quantity: number;
		price: number;
		img: string;
		variantValue: string;
		totalPrice: number;
		cartId: number;
		isSelected: boolean;
	}) => void;
};

const CartItem = ({ id, img, name, quantities, price, variantValue, productId, cartId, onSelect }: Props) => {
	const [quantity, setQuantity] = useState<number>(quantities);
	const [totalPrice, setTotalPrice] = useState<number>(price * quantities);
	const [isSelected, setIsSelected] = useState<boolean>(false);

	const cartService = new CartServices(URL_SERVICE, () => {});
	const [messageApi, ContextHolder] = message.useMessage();
	const dispath = useDispatch();

	const onChange: CheckboxProps['onChange'] = (e) => {
		setIsSelected(e.target.checked);
		if (onSelect) {
			onSelect({
				id,
				name,
				quantity,
				price,
				img,
				cartId,
				variantValue,
				totalPrice: price * quantities,
				isSelected: e.target.checked,
			});
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await cartService.deleteCart(id);
			messageApi.success('xóa thành công');
		} catch (err) {
			console.log(err);
			messageApi.error('xóa không thành công');
		} finally {
			dispath(deleteCart(id));
		}
	};

	const handlePrev = () => {
		if (quantity > 1) {
			const newQuantity = quantity - 1;
			setQuantity(newQuantity);
			const newTotalPrice = newQuantity * price;
			setTotalPrice(newTotalPrice);
			if (onSelect && isSelected) {
				onSelect({
					id,
					name,
					quantity: newQuantity,
					price,
					img,
					cartId,
					variantValue,
					totalPrice: newTotalPrice,
					isSelected,
				});
			}
		}
	};

	const handlePlus = () => {
		const newQuantity = quantity + 1;
		setQuantity(newQuantity);
		const newTotalPrice = newQuantity * price;
		setTotalPrice(newTotalPrice);
		if (onSelect && isSelected) {
			onSelect({
				id,
				name,
				quantity: newQuantity,
				price,
				img,
				cartId,
				variantValue,
				totalPrice: newTotalPrice,
				isSelected,
			});
		}
	};

	return (
		<div className="bg-white grid items-center py-2 px-4 text-[#242424] gap-x-6 grid-cols-[auto_180px_120px_120px_20px] mb-2">
			{ContextHolder}
			<div className="flex items-center gap-x-2">
				<Checkbox onChange={onChange}></Checkbox>
				<div className="flex items-center gap-x-2 cursor-pointer">
					<div className=" w-[80px] h-[80px]">
						<img src={img} alt="" className="w-full h-full object-contain" />
					</div>
					<Link href={`/productdetail/${productId}`}>
						<div className="cart-item__details ">
							<h3 className="text-[14px] leading-[150%] text-[#27272a] line-clamp-2 hover:text-[#0b74e5]">
								{name}
							</h3>
							<p className="cart-item__description">{variantValue}</p>
						</div>
					</Link>
				</div>
			</div>
			<div className="cart-item__unit-price">
				<div className="">
					<span className="text-[#ff424e] text-[14px] leading-[21px] font-[600]">{formatPrice(price)}</span>
					<span className="line-through ml-1 text-[12px] text-[#808089] font-[400]">
						{formatPrice(price)}
					</span>
				</div>
				<span className="text-[12px] leading-[18px] text-left text-[#808089] mt-1">
					Giá chưa áp dụng khuyến mãi
				</span>
			</div>

			<div className="flex items-center gap-x-2 border-[1px] border-[c8c8c8] border-solid w-[100px] rounded-[3px]">
				<button
					onClick={handlePrev}
					className="cursor-pointer text-center min-w-[24px] border-r-[1px] border-[c8c8c8] border-solid"
				>
					-
				</button>
				<input
					defaultValue={quantity}
					value={quantity}
					className="max-w-[32px] text-center text-[13px] appearance-none outline-none"
				/>
				<button
					onClick={handlePlus}
					className="cursor-pointer text-center min-w-[24px] border-l-[1px] border-[c8c8c8] border-solid"
				>
					+
				</button>
			</div>
			<div className="cart-item__total-price">
				<span className="cart-item__total-price-value">{formatPrice(totalPrice)}</span>
			</div>
			<Popconfirm
				title="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
				onConfirm={() => handleDelete(cartId)}
				okText="Xóa"
				cancelText="Hủy"
			>
				<button className="cursor-pointer">
					<FaRegTrashCan />
				</button>
			</Popconfirm>
		</div>
	);
};

export default CartItem;
