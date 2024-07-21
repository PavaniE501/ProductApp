import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store, {RootState, AppDispatch} from './src/components/store';
import { addToCart, incrementQuantity, decrementQuantity } from './src/components/cartSlice';
import {BlurView} from '@react-native-community/blur';

// import StarRating from 'react-native-star-rating';

interface Rating {
  rate: number;
  count: number;
}
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  rating: Rating;
  category: string;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const renderProduct = ({item}: {item: Product}) => (
    <TouchableOpacity
      onPress={() => openModal(item)}
      style={styles.productContainer}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {/* <StarRating
          disabled={true}
          starSize={20}
          maxStars={5}
          rating={item.rating.rate}
          fullStarColor="gold"
          emptyStarColor="#e0e0e0"
        /> */}

        <Text style={styles.itemTitle}>{item.rating.count}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        <Text style={styles.itemCategory}>Category: {item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Shopping</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
      />
      <Modal
        visible={!!selectedProduct}
        onRequestClose={closeModal}
        animationType="slide">
        <BlurView
          style={styles.blurViewContainer}
          blurType={'dark'}
          blurAmount={1}
        />
        <View style={styles.modalContainer}>
          <View style={styles.subcontainer}>
            <View style={styles.popupContainer}>
              {selectedProduct && (
                <>
                  <Image
                    source={{uri: selectedProduct.image}}
                    style={styles.image}
                  />
                  <Text style={styles.productTitle}>
                    {selectedProduct.title}
                  </Text>
                  <Text>${selectedProduct.price}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.productDescription}>Description: </Text>
                    <Text style={styles.productMessage}>
                      {selectedProduct.description}
                    </Text>
                  </View>

                  {/* <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cartButton}
                      onPress={() => {
                        dispatch(addToCart(selectedProduct));
                        closeModal();
                      }}>
                      <Text style={styles.cartText}>Add to Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={closeModal}>
                      <Text>Close</Text>
                    </TouchableOpacity>
                  </View> */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(addToCart(selectedProduct));
                        closeModal();
                      }}
                      style={styles.cartButton}>
                      <Text style={styles.cartText}>Add to Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={closeModal}
                      style={styles.closeButton}>
                      <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.cartContainer}>
        {cart.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <Text>
              {item.title} (x{item.quantity})
            </Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={() => dispatch(incrementQuantity(item.id))}>
                <Text>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => dispatch(decrementQuantity(item.id))}>
                <Text>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    // backgroundColor: 'red ',
    backgroundColor: '#5EDBDB',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
  },
  cartButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 12,
  },
  closeButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#D5DBDB',
    borderRadius: 12,
  },
  cartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productContainer: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  blurViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  productImage: {
    width: 120,
    height: 120,
    marginRight: 10,
  },
  itemCategory: {
    fontSize: 16,
    color: '#808080',
  },
  productDetails: {
    justifyContent: 'center',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    // padding: 20,
    // backgroundColor: 'white',
  },
  subcontainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  popupContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 8,
  },

  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 16,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
    color: 'black',
    marginLeft: 10,
  },
  productMessage: {
    fontSize: 18,
    marginVertical: 10,
    color: 'black',
    flexShrink: 1,
    marginRight: 10,
    // textAlign: 'center',
  },
  productDescription: {
    fontSize: 18,
    marginVertical: 10,
    color: 'black',
    marginLeft: 10,
    // textAlign: 'center',
  },
  itemTitle: {
    // fontWeight: 'bold',
    fontSize: 18,
    // marginVertical: 10,
    color: 'black',
  },
  itemPrice: {
    fontWeight: 'bold',
    fontSize: 18,
    // marginVertical: 10,
    color: 'black',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cartContainer: {
    padding: 10,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
