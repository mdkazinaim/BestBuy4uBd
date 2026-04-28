import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import { useDeleteProductMutation } from "@/store/Api/ProductApi";
import { toast } from "sonner";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  productName: string | null;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
}) => {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (!productId) return;
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Delete error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="w-5 h-5" />
            Delete Product
          </div>
        </ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-bold italic">"{productName}"</span>? 
            This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isLoading}
          >
            Confirm Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteProductModal;
