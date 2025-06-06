/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServicesBase } from '../servicesBase';
import { IProductForm } from '@/models/Shop/createProduct.model';
class ProductServices extends ServicesBase {
	constructor(baseUrl: string, onUnauthenticated: () => void) {
		super(baseUrl, onUnauthenticated);
	}
	createProduct(data: IProductForm) {
		console.log('data', data);
		return this.service.post('/create-product', data);
	}
	getAllProducts() {
		return this.service.get('/get-all-products');
	}
	getAllProductsAdmin() {
		return this.service.get('/get-all-products-admin');
	}
	getProductById(productId: any) {
		return this.service.get(`/get-product-by-id/${productId}`);
	}
	getProductByCategoryID(categoryId: number) {
		return this.service.get(`/get-product-by-category-id/${categoryId}`);
	}
	getProductByShopId(shopId: number) {
		return this.service.get(`/get-product-by-shop-id/${shopId}`);
	}
	updateProduct(productId: any, data: any) {
		return this.service.put(`/update-product/${productId}`, data);
	}
	searchProduct(search: string) {
		return this.service.post('/search-product', { search });
	}
	updateStatusProduct(productId: any, status: string) {
		return this.service.put(`/update-status-product/${productId}`, { status });
	}
}
export default ProductServices;
