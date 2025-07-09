import { SheetContent } from "@/components/ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { fetchCart, updateQty } from "@/redux/reducers/cartSlice";
import { Plus, Minus } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { useEffect } from "react";
// import { removeFromCart } from "@/redux/reducers/cartSlice"; // Create this if not done
const CartSheet = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  console.log(items);

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );

  const fetchItem = async () => {
    try {
      await dispatch(fetchCart());
    } catch (error) {
      console.error(`error while fetching items : ${error}`);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <SheetContent side="right" className="w-[400px] max-w-full p-4">
      <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm"
            >
              {/* Product Image */}
              <img
                src={item.product.image1}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-md"
              />

              {/* Product Details */}
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-gray-800 dark:text-white">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500">
                  ₹{item.product.price} × {item.qty} ({item.size})
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    disabled={item.qty <= 1}
                    onClick={() =>
                      dispatch(updateQty({ id: item._id, qty: item.qty - 1 }))
                    }
                    className="w-7 h-7 flex items-center justify-center rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-medium">{item.qty}</span>
                  <button
                    disabled={item.qty >= 3}
                    onClick={() =>
                      dispatch(updateQty({ id: item._id, qty: item.qty + 1 }))
                    }
                    className="w-7 h-7 flex items-center justify-center rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Track & Remove */}
              <div className="flex flex-col items-center gap-2">
                <MdDelete
                  size={20}
                  className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  onClick={() => dispatch(removeFromCart(item._id))}
                />
              </div>
            </div>
          ))}

          {/* Total & Checkout */}
          <div className="mt-4">
            <p className="font-semibold text-lg">Total: ₹{total.toFixed(2)}</p>
            <Button className="w-full mt-2">Checkout</Button>
          </div>
        </div>
      )}
    </SheetContent>
  );
};

export default CartSheet;
