import { SheetContent } from "@/components/ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
// import { removeFromCart } from "@/redux/reducers/cartSlice"; // Create this if not done
const items = [{ item: "apple" }];
const CartSheet = ({ onClose }) => {
  //   const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <SheetContent side="right" className="w-[400px] max-w-full p-4">
      <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.price} × {item.qty}
                </p>
              </div>
              <Button
                variant="ghost"
                // onClick={() => dispatch(removeFromCart(item._id))}
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="mt-4">
            <p className="font-semibold">Total: ₹{total.toFixed(2)}</p>
            <Button
              className="w-full mt-2"
              onClick={() => alert("Checkout coming soon!")}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </SheetContent>
  );
};

export default CartSheet;
