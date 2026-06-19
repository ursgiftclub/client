"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { FiMapPin, FiEdit2, FiTrash2, FiPlus, FiCheck } from "react-icons/fi";

import axiosInstance from "@/lib/axios";

const initialAddressForm = {
  fullName: "",
  phone: "",
  alternatePhone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  addressType: "home",
  isDefault: false,
};

export default function AddressesPage() {
  const [loading, setLoading] = useState(true);

  const [addresses, setAddresses] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [savingAddress, setSavingAddress] = useState(false);

  const [editingAddress, setEditingAddress] = useState(null);

  const [addressForm, setAddressForm] = useState(initialAddressForm);

  const resetAddressForm = () => {
    setAddressForm(initialAddressForm);
  };

  const closeAddressModal = () => {
    resetAddressForm();

    setEditingAddress(null);

    setShowModal(false);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone" || name === "alternatePhone") {
      const numbersOnly = value.replace(/\D/g, "");

      setAddressForm((prev) => ({
        ...prev,
        [name]: numbersOnly.slice(0, 10),
      }));

      return;
    }

    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get("/address");

      setAddresses(data.addresses || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();

    return () => {
      resetAddressForm();
    };
  }, []);

  const handleAddAddress = () => {
    setEditingAddress(null);

    resetAddressForm();

    setShowModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);

    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      alternatePhone: address.alternatePhone || "",
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      landmark: address.landmark || "",
      city: address.city,
      state: address.state,
      country: address.country,
      pincode: address.pincode,
      addressType: address.addressType,
      isDefault: address.isDefault,
    });

    setShowModal(true);
  };

  const handleDeleteAddress = async (id) => {
    const confirmed = window.confirm("Delete this address?");

    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/addresses/${id}`);

      setAddresses((prev) => prev.filter((address) => address._id !== id));

      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axiosInstance.patch(`/address/${id}/default`);

      toast.success("Default address updated");

      loadAddresses();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update default address",
      );
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (addressForm.phone.length !== 10) {
      toast.error("Please enter a valid phone number");

      return;
    }

    try {
      setSavingAddress(true);

      if (editingAddress) {
        await axiosInstance.put(
          `/addresses/${editingAddress._id}`,
          addressForm,
        );

        toast.success("Address updated successfully");
      } else {
        await axiosInstance.post("/addresses", addressForm);

        toast.success("Address added successfully");
      }

      closeAddressModal();

      loadAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Addresses</h1>

            <p className="mt-2 text-muted-foreground">
              Manage your delivery addresses
            </p>
          </div>

          <button
            onClick={handleAddAddress}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground"
          >
            <FiPlus />
            Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="rounded-[2rem] border border-border bg-card p-12 text-center">
            <FiMapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

            <h2 className="text-2xl font-bold">No Addresses Found</h2>

            <p className="mt-2 text-muted-foreground">
              Add your first delivery address.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="rounded-[2rem] border border-border bg-card p-6 shadow-sm"
              >
                {/* Top */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs capitalize">
                    {address.addressType}
                  </span>

                  {address.isDefault && (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                      Default
                    </span>
                  )}
                </div>

                {/* Address Info */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{address.fullName}</h3>

                  <p className="mt-2 font-medium">+91 {address.phone}</p>

                  {address.alternatePhone && (
                    <p className="text-muted-foreground">
                      Alt: +91 {address.alternatePhone}
                    </p>
                  )}

                  <div className="mt-4 space-y-1 text-muted-foreground">
                    <p>{address.addressLine1}</p>

                    {address.addressLine2 && <p>{address.addressLine2}</p>}

                    {address.landmark && <p>Landmark: {address.landmark}</p>}

                    <p>
                      {address.city}, {address.state}
                    </p>

                    <p>
                      {address.country} - {address.pincode}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm"
                    >
                      <FiCheck />
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() => handleEditAddress(address)}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm"
                  >
                    <FiEdit2 />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-500 px-4 text-sm text-red-500"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingAddress ? "Edit Address" : "Add Address"}
                </h2>

                <button onClick={closeAddressModal} className="text-xl">
                  ✕
                </button>
              </div>

              <p className="mb-4 text-xs text-muted-foreground">
                Fields marked with <span className="text-red-500">*</span> are
                required.
              </p>

              <form
                onSubmit={handleSaveAddress}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="fullName"
                    value={addressForm.fullName}
                    onChange={handleAddressChange}
                    placeholder="Enter full name"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      +91
                    </span>

                    <input
                      type="tel"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="h-12 w-full rounded-xl border border-border bg-background pl-14 pr-4 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Alternate Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Alternate Phone
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      +91
                    </span>

                    <input
                      type="tel"
                      name="alternatePhone"
                      value={addressForm.alternatePhone}
                      onChange={handleAddressChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="h-12 w-full rounded-xl border border-border bg-background pl-14 pr-4 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Address Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Address Type
                  </label>

                  <select
                    name="addressType"
                    value={addressForm.addressType}
                    onChange={handleAddressChange}
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Address Line 1 */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="addressLine1"
                    value={addressForm.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="House No, Street, Area"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Address Line 2
                  </label>

                  <input
                    name="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Apartment, Building, Floor"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                  />
                </div>

                {/* Landmark */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Landmark
                  </label>

                  <input
                    name="landmark"
                    value={addressForm.landmark}
                    onChange={handleAddressChange}
                    placeholder="Near Bus Stand"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    City <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    placeholder="Hisar"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    State <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    placeholder="Haryana"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Pincode <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleAddressChange}
                    maxLength={6}
                    placeholder="125001"
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Country
                  </label>

                  <input
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressChange}
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
                  />
                </div>

                {/* Default Address */}
                <label className="flex items-center gap-3 md:col-span-2">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressChange}
                    className="h-4 w-4"
                  />

                  <span className="text-sm">Make this my default address</span>
                </label>

                {/* Submit */}

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground"
                  >
                    {savingAddress
                      ? "Saving..."
                      : editingAddress
                        ? "Update Address"
                        : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
