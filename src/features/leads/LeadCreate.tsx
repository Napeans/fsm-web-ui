import { useRef, useState, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Send, PlusCircle, Eraser } from "lucide-react";
import { fetchCustomerByMobile, createLead } from "./lead.service";
import { extractLatLng } from "../../utils/mapUtils";
import AppDialog from "../../components/AppDialog";
import AppLoader from "../../components/AppLoader";
import "./LeadCreate.css";
import type { CreateCustomerAddressRequest, CreateLeadRequest } from "./lead.types";

const LeadCreate = () => {
  const [mobile, setMobile] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [serviceTypeId, setServiceTypeId] = useState<number>(0);
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [latLng, setLatLng] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCustomerId, setActiveCustomerId] = useState<number>(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressMapLink, setAddressMapLink] = useState("");
  const [draftAddress, setDraftAddress] = useState<CreateCustomerAddressRequest | null>(null);
  const [addressForm, setAddressForm] = useState<CreateCustomerAddressRequest>({
    customerAddressId: 0,
    addressType: "",
    addressLine1: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    latitude: null,
    longitude: null,
    isDefault: false,
  });
  const [customerForm, setCustomerForm] = useState({
    customerName: "",
    customerGST: "",
    whatsappNo: "",
    emailId: "",
  });
  const [dialogMessage, setDialogMessage] = useState("");
  const [loaderMessage, setLoaderMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [newCustomerNotice, setNewCustomerNotice] = useState("");
  const navigate = useNavigate();
  const mobileRef = useRef<HTMLInputElement | null>(null);
  const customerNameRef = useRef<HTMLInputElement | null>(null);
  const customerGstRef = useRef<HTMLInputElement | null>(null);
  const serviceTypeRef = useRef<HTMLSelectElement | null>(null);
  const scheduleRef = useRef<HTMLInputElement | null>(null);
  const addressLine1Ref = useRef<HTMLInputElement | null>(null);
  const pincodeRef = useRef<HTMLInputElement | null>(null);

  const isExistingCustomer = activeCustomerId > 0;
  const showAlert = (message: string) => setDialogMessage(message);
  const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const resetForm = () => {
    setMobile("");
    setCustomer(null);
    setAddresses([]);
    setSelectedAddressId(0);
    setServiceTypeId(0);
    setScheduledDateTime("");
    setRemarks("");
    setLatLng(null);
    setHasSearched(false);
    setActiveCustomerId(0);
    setShowAddressModal(false);
    setAddressMapLink("");
    setDraftAddress(null);
    setAddressForm({
      customerAddressId: 0,
      addressType: "",
      addressLine1: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      latitude: null,
      longitude: null,
      isDefault: false,
    });
    setCustomerForm({
      customerName: "",
      customerGST: "",
      whatsappNo: "",
      emailId: "",
    });
    setFieldErrors({});
    setNewCustomerNotice("");
  };

  const setErrorAndFocus = (field: string, message: string, ref?: RefObject<HTMLInputElement | HTMLSelectElement | null>) => {
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
    ref?.current?.focus();
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const fetchPostalDetails = async (pincode: string) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      const first = Array.isArray(data) ? data[0] : null;
      const postOffice = first?.PostOffice?.[0];
      if (!postOffice) {
        return;
      }
      const city = postOffice.District ?? postOffice.Block ?? postOffice.Name ?? "";
      const state = postOffice.State ?? "";
      setAddressForm((prev) => ({
        ...prev,
        city: city || prev.city,
        state: state || prev.state,
      }));
    } catch (error) {
      console.error("Pincode lookup failed", error);
    }
  };

  const resolveAddressLatLng = (address: any) => {
    const latitude = Number(address?.Latitude ?? address?.latitude ?? 0);
    const longitude = Number(address?.Longitude ?? address?.longitude ?? 0);
    if (Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0 && longitude !== 0) {
      setLatLng({ latitude, longitude });
      return;
    }
    setLatLng(null);
  };

  const handleMobileSearch = async () => {
    const enteredMobile = mobile.trim();
    if (!enteredMobile) {
      setErrorAndFocus("mobile", "Mobile number is required", mobileRef);
      return;
    }
    clearFieldError("mobile");
    setNewCustomerNotice("");

    setHasSearched(true);
    setSelectedAddressId(0);
    setDraftAddress(null);

    try {
      setLoaderMessage("Searching customer...");
      setLoading(true);
      const data = await fetchCustomerByMobile(enteredMobile);

      if (data && !data.IsNewCustomer) {
        const customerId = Number(data.CustomerId ?? data.customerId ?? 0);
        const addressList = data.Addresses ?? data.addresses ?? [];

        setCustomer(data);
        setActiveCustomerId(customerId);
        setAddresses(addressList);
        setCustomerForm({
          customerName: data.customerName ?? data.CustomerName ?? "",
          customerGST: data.customerGST ?? data.CustomerGST ?? "",
          whatsappNo: data.whatsappNo ?? data.WhatsappNo ?? mobile,
          emailId: data.emailId ?? data.EmailId ?? "",
        });
        setLatLng(null);
        setNewCustomerNotice("");
        return;
      }

      setCustomer(null);
      setActiveCustomerId(0);
      setAddresses([]);
      setLatLng(null);
      setCustomerForm((prev) => ({
        ...prev,
        customerName: "",
        customerGST: "",
        whatsappNo: prev.whatsappNo || enteredMobile,
      }));
      setNewCustomerNotice("New customer detected. Add customer details and address.");
    } catch (error) {
      console.error("Customer search failed", error);
      showAlert("Unable to search customer right now");
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const openAddressModal = () => {
    setAddressMapLink("");
    setAddressForm({
      customerAddressId: 0,
      addressType: "",
      addressLine1: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      latitude: null,
      longitude: null,
      isDefault: false,
    });

    setCustomerForm((prev) => ({
      customerName: prev.customerName || customer?.customerName || customer?.CustomerName || "",
      customerGST: prev.customerGST || customer?.customerGST || customer?.CustomerGST || "",
      whatsappNo: prev.whatsappNo || customer?.whatsappNo || customer?.WhatsappNo || mobile,
      emailId: prev.emailId || customer?.emailId || customer?.EmailId || "",
    }));
    setShowAddressModal(true);
  };

  const handleAddressFormChange = (
    field: keyof CreateCustomerAddressRequest,
    value: string | number | boolean | null
  ) => {
    if (field === "pincode" && typeof value === "string") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 6);
      setAddressForm((prev) => ({
        ...prev,
        [field]: onlyDigits,
      }));
      clearFieldError("addressPincode");
      if (onlyDigits.length === 6) {
        void fetchPostalDetails(onlyDigits);
      }
      return;
    }
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressMapExtract = () => {
    const result = extractLatLng(addressMapLink);
    if (!result) {
      if (addressMapLink.includes("maps.app.goo.gl")) {
        showAlert("Short Google Maps links cannot be parsed directly. Open the link, copy the expanded URL with @lat,lng or q=lat,lng, then paste here.");
      } else {
        showAlert("Unable to extract coordinates. Use a Google Maps URL containing @lat,lng or q=lat,lng.");
      }
      return;
    }

    handleAddressFormChange("latitude", Number(result.latitude));
    handleAddressFormChange("longitude", Number(result.longitude));
  };

  const handleSaveAddress = async () => {
    const errors: Record<string, string> = {};
    if (!addressForm.addressLine1?.trim()) {
      errors.addressLine1 = "AddressLine1 is required";
    }

    if (!isExistingCustomer && !customerForm.customerName.trim()) {
      errors.customerName = "CustomerName is required";
    }
    if (addressForm.pincode && addressForm.pincode.length !== 6) {
      errors.addressPincode = "Pincode must be 6 digits";
    }
    if (customerForm.customerGST.trim() && !gstPattern.test(customerForm.customerGST.trim().toUpperCase())) {
      errors.customerGST = "Invalid GST format";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      if (errors.customerName) {
        customerNameRef.current?.focus();
      } else if (errors.customerGST) {
        customerGstRef.current?.focus();
      } else if (errors.addressLine1) {
        addressLine1Ref.current?.focus();
      } else if (errors.addressPincode) {
        pincodeRef.current?.focus();
      }
      return;
    }

    setDraftAddress({
      ...addressForm,
      googleMapLink: addressMapLink.trim() || undefined,
    });
    setSelectedAddressId(0);
    if (addressForm.latitude && addressForm.longitude) {
      setLatLng({ latitude: Number(addressForm.latitude), longitude: Number(addressForm.longitude) });
    } else {
      setLatLng(null);
    }
    setShowAddressModal(false);
  };

  const handleCreateLead = async () => {
    const errors: Record<string, string> = {};
    if (!mobile.trim()) {
      errors.mobile = "Customer mobile number is required";
    }
    if (!serviceTypeId) {
      errors.serviceTypeId = "Select service type";
    }
    if (!scheduledDateTime) {
      errors.scheduledDateTime = "Select schedule date and time";
    }
    if (!isExistingCustomer && !customerForm.customerName.trim()) {
      errors.customerName = "Customer name is required";
    }
    if (customerForm.customerGST.trim() && !gstPattern.test(customerForm.customerGST.trim().toUpperCase())) {
      errors.customerGST = "Invalid GST format";
    }
    if (isExistingCustomer && !draftAddress && !selectedAddressId) {
      errors.selectedAddressId = "Select an address or add new address";
    }
    if (!isExistingCustomer && !draftAddress) {
      errors.draftAddress = "Add address details";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      if (errors.mobile) {
        mobileRef.current?.focus();
      } else if (errors.customerName) {
        customerNameRef.current?.focus();
      } else if (errors.customerGST) {
        customerGstRef.current?.focus();
      } else if (errors.serviceTypeId) {
        serviceTypeRef.current?.focus();
      } else if (errors.scheduledDateTime) {
        scheduleRef.current?.focus();
      }
      return;
    }

    const basePayload = {
      serviceTypeId,
      scheduledOn: new Date(scheduledDateTime).toISOString(),
      remarks,
    };

    const payload: CreateLeadRequest =
      isExistingCustomer && !draftAddress
        ? {
            ...basePayload,
            customerId: activeCustomerId,
            customerAddressId: selectedAddressId,
          }
        : {
            ...basePayload,
            customerId: isExistingCustomer ? activeCustomerId : undefined,
            customerName: customerForm.customerName,
            customerGST: customerForm.customerGST,
            mobileNo: mobile,
            whatsappNo: customerForm.whatsappNo,
            emailId: customerForm.emailId,
            addresse: draftAddress ?? undefined,
          };

    try {
      setLoaderMessage("Creating lead...");
      setLoading(true);
      if (!isExistingCustomer) {
        const address = draftAddress;
        const hasAnyAddressInfo =
          Boolean(address?.addressType?.trim()) ||
          Boolean(address?.addressLine1?.trim()) ||
          Boolean(address?.area?.trim()) ||
          Boolean(address?.city?.trim()) ||
          Boolean(address?.state?.trim()) ||
          Boolean(address?.pincode?.trim()) ||
          (address?.latitude != null && address?.longitude != null);

        if (!payload.customerName?.trim() || !address || !hasAnyAddressInfo) {
          setErrorAndFocus("draftAddress", "Add complete address details");
          return;
        }
      }

      await createLead(payload);
      resetForm();
      navigate("/leads");
    } catch (error) {
      console.error("Create lead failed", error);
      showAlert("Unable to create lead");
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const handleAddressSelect = (value: string) => {
    const addressId = Number(value);
    setSelectedAddressId(addressId);
    const selected = addresses.find(
      (a) => Number(a.CustomerAddressId ?? a.customerAddressId ?? 0) === addressId
    );
    if (selected) {
      resolveAddressLatLng(selected);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Lead</h1>
      </div>

      <div className="form-grid">
        <div className="form-card">
          <div className="card-header customer-card-header">
            <Search size={18} />
            <h3>Customer Details</h3>
          </div>
          <div className="card-body">
            <div className="input-group">
              <label>Customer Mobile Number</label>
              <div className="search-control-group">
                  <input
                    ref={mobileRef}
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={mobile}
                    className={fieldErrors.mobile ? "input-error" : ""}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      clearFieldError("mobile");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      void handleMobileSearch();
                    }
                  }}
                />
                <button
                  className="btn-secondary search-icon-btn"
                  onClick={handleMobileSearch}
                  aria-label="Search customer by mobile number"
                  title="Search customer"
                >
                  <Search size={16} />
                </button>
              </div>
              {fieldErrors.mobile && <p className="error-text">{fieldErrors.mobile}</p>}
            </div>

            {hasSearched && (
              <div className="customer-info">
                <h4>{isExistingCustomer ? customer?.customerName ?? customer?.CustomerName : "New customer"}</h4>
                {!isExistingCustomer && newCustomerNotice && <p className="new-customer-note">{newCustomerNotice}</p>}

                {isExistingCustomer ? (
                  <p className="help-text">Customer Name: {customerForm.customerName || "-"}</p>
                ) : (
                  <div className="modal-grid">
                    <div className="input-group">
                      <label>Customer Name</label>
                      <input
                        ref={customerNameRef}
                        value={customerForm.customerName}
                        className={fieldErrors.customerName ? "input-error" : ""}
                        onChange={(e) => {
                          setCustomerForm((prev) => ({ ...prev, customerName: e.target.value }));
                          clearFieldError("customerName");
                        }}
                        placeholder="Enter customer name"
                      />
                      {fieldErrors.customerName && <p className="error-text">{fieldErrors.customerName}</p>}
                    </div>
                    <div className="input-group">
                      <label>CustomerGST</label>
                      <input
                        ref={customerGstRef}
                        value={customerForm.customerGST}
                        className={fieldErrors.customerGST ? "input-error" : ""}
                        onChange={(e) => {
                          const upper = e.target.value.toUpperCase();
                          setCustomerForm((prev) => ({ ...prev, customerGST: upper }));
                          clearFieldError("customerGST");
                        }}
                        onBlur={() => {
                          if (customerForm.customerGST.trim() && !gstPattern.test(customerForm.customerGST.trim().toUpperCase())) {
                            setFieldErrors((prev) => ({ ...prev, customerGST: "Invalid GST format" }));
                          }
                        }}
                        placeholder="Enter GST number"
                      />
                      {fieldErrors.customerGST && <p className="error-text">{fieldErrors.customerGST}</p>}
                    </div>
                  </div>
                )}

                {isExistingCustomer && addresses.length > 0 && (
                  <div className="input-group">
                    <label>Select Address</label>
                    <select
                      className={fieldErrors.selectedAddressId ? "input-error" : ""}
                      value={selectedAddressId || ""}
                      onChange={(e) => {
                        handleAddressSelect(e.target.value);
                        clearFieldError("selectedAddressId");
                      }}
                    >
                      <option value="">Choose an address...</option>
                      {addresses.map((a) => {
                        const id = a.CustomerAddressId ?? a.customerAddressId;
                        return (
                          <option key={id} value={id}>
                            {(a.AddressType ?? a.addressType) || "Address"}: {(a.Area ?? a.area) || "-"} ({(a.Pincode ?? a.pincode) || "-"})
                          </option>
                        );
                      })}
                    </select>
                    {fieldErrors.selectedAddressId && <p className="error-text">{fieldErrors.selectedAddressId}</p>}
                  </div>
                )}

                {draftAddress && (
                  <div className="draft-address-preview">
                    <p className="help-text">
                      Address added in draft. It will be submitted with Create Lead.
                    </p>
                    <p className="help-text">
                      <strong>Type:</strong> {draftAddress.addressType || "-"} | <strong>Area:</strong>{" "}
                      {draftAddress.area || "-"} | <strong>Pincode:</strong> {draftAddress.pincode || "-"}
                    </p>
                    <p className="help-text">
                      <strong>Address:</strong> {draftAddress.addressLine1 || "-"}
                    </p>
                    <p className="help-text">
                      <strong>Lat/Lng:</strong>{" "}
                      {draftAddress.latitude != null && draftAddress.longitude != null
                        ? `${draftAddress.latitude}, ${draftAddress.longitude}`
                        : "-"}
                    </p>
                    <p className="help-text">
                      <strong>Map Link:</strong> {draftAddress.googleMapLink || "-"}
                    </p>
                  </div>
                )}

                <button className="btn-outline add-address-btn" onClick={openAddressModal}>
                  + Add New Address
                </button>
                {fieldErrors.draftAddress && <p className="error-text">{fieldErrors.draftAddress}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="form-card">
          <div className="card-header service-card-header">
            <PlusCircle size={18} />
            <h3>Service Details</h3>
          </div>
          <div className="card-body">
            <div className="input-group">
              <label>Select Service Type</label>
              <select
                ref={serviceTypeRef}
                className={fieldErrors.serviceTypeId ? "input-error" : ""}
                value={serviceTypeId || ""}
                onChange={(e) => {
                  setServiceTypeId(Number(e.target.value));
                  clearFieldError("serviceTypeId");
                }}
              >
                <option value="">Choose a service...</option>
                <option value={1}>AC Installation</option>
                <option value={2}>AC Servicing</option>
                <option value={3}>Gas Filling</option>
              </select>
              {fieldErrors.serviceTypeId && <p className="error-text">{fieldErrors.serviceTypeId}</p>}
            </div>

            <div className="input-group">
              <label>Schedule Date & Time</label>
              <input
                ref={scheduleRef}
                className={fieldErrors.scheduledDateTime ? "input-error" : ""}
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => {
                  setScheduledDateTime(e.target.value);
                  clearFieldError("scheduledDateTime");
                }}
              />
              {fieldErrors.scheduledDateTime && <p className="error-text">{fieldErrors.scheduledDateTime}</p>}
            </div>

            <div className="input-group">
              <label>Remarks</label>
              <textarea
                className="remarks-input"
                placeholder="Enter additional remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
              />
            </div>

            <div className="service-actions">
              <button className="btn-outline clear-form-btn" onClick={resetForm}>
                <Eraser size={16} />
                Clear
              </button>
              <button className="btn-primary create-lead-btn" onClick={handleCreateLead}>
                <Send size={16} />
                Create Lead
              </button>
            </div>
          </div>
        </div>

        <div className="form-card full-width">
          <div className="card-header location-card-header">
            <MapPin size={18} />
            <h3>Location Information</h3>
          </div>
          <div className="card-body">
            {latLng ? (
              <div className="map-preview">
                <iframe
                  width="100%"
                  height="250"
                  src={`https://maps.google.com/maps?q=${latLng.latitude},${latLng.longitude}&output=embed`}
                  style={{ border: 0, borderRadius: "8px" }}
                ></iframe>
              </div>
            ) : (
              <p className="help-text">Select existing address or add new address to view map preview.</p>
            )}

          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add New Address</h3>
            </div>

            <div className="modal-body">
              <div className="modal-grid">
                {isExistingCustomer ? (
                  <div className="input-group">
                    <label>CustomerName</label>
                    <p className="help-text">{customerForm.customerName || "-"}</p>
                  </div>
                ) : (
                  <div className="modal-grid full-span">
                    <div className="input-group">
                      <label>CustomerName</label>
                      <input
                        ref={customerNameRef}
                        className={fieldErrors.customerName ? "input-error" : ""}
                        value={customerForm.customerName}
                        onChange={(e) => {
                          setCustomerForm((prev) => ({ ...prev, customerName: e.target.value }));
                          clearFieldError("customerName");
                        }}
                        placeholder="Customer name"
                      />
                      {fieldErrors.customerName && <p className="error-text">{fieldErrors.customerName}</p>}
                    </div>
                    <div className="input-group">
                      <label>CustomerGST</label>
                      <input
                        ref={customerGstRef}
                        className={fieldErrors.customerGST ? "input-error" : ""}
                        value={customerForm.customerGST}
                        onChange={(e) => {
                          const upper = e.target.value.toUpperCase();
                          setCustomerForm((prev) => ({ ...prev, customerGST: upper }));
                          clearFieldError("customerGST");
                        }}
                        onBlur={() => {
                          if (customerForm.customerGST.trim() && !gstPattern.test(customerForm.customerGST.trim().toUpperCase())) {
                            setFieldErrors((prev) => ({ ...prev, customerGST: "Invalid GST format" }));
                          }
                        }}
                        placeholder="GST number"
                      />
                      {fieldErrors.customerGST && <p className="error-text">{fieldErrors.customerGST}</p>}
                    </div>
                  </div>
                )}
                <div className="input-group">
                  <label>MobileNo</label>
                  <input value={mobile} readOnly />
                </div>
                <div className="input-group">
                  <label>WhatsappNo</label>
                  <input
                    value={customerForm.whatsappNo}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, whatsappNo: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label>EmailId</label>
                  <input
                    type="email"
                    value={customerForm.emailId}
                    onChange={(e) => setCustomerForm((prev) => ({ ...prev, emailId: e.target.value }))}
                  />
                </div>
              </div>

              <h4 className="section-title">Address Details</h4>
              <div className="input-group">
                <label>AddressType</label>
                <input
                  value={addressForm.addressType ?? ""}
                  onChange={(e) => handleAddressFormChange("addressType", e.target.value)}
                />
              </div>

              <div className="modal-grid">
                <div className="input-group">
                  <label>Pincode</label>
                  <input
                    ref={pincodeRef}
                    className={fieldErrors.addressPincode ? "input-error" : ""}
                    value={addressForm.pincode ?? ""}
                    onChange={(e) => handleAddressFormChange("pincode", e.target.value)}
                    inputMode="numeric"
                    maxLength={6}
                  />
                  {fieldErrors.addressPincode && <p className="error-text">{fieldErrors.addressPincode}</p>}
                </div>
                <div className="input-group">
                  <label>AddressLine1</label>
                  <input
                    ref={addressLine1Ref}
                    className={fieldErrors.addressLine1 ? "input-error" : ""}
                    value={addressForm.addressLine1 ?? ""}
                    onChange={(e) => {
                      handleAddressFormChange("addressLine1", e.target.value);
                      clearFieldError("addressLine1");
                    }}
                  />
                  {fieldErrors.addressLine1 && <p className="error-text">{fieldErrors.addressLine1}</p>}
                </div>
                <div className="input-group">
                  <label>Area</label>
                  <input value={addressForm.area ?? ""} onChange={(e) => handleAddressFormChange("area", e.target.value)} />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input value={addressForm.city ?? ""} onChange={(e) => handleAddressFormChange("city", e.target.value)} />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input value={addressForm.state ?? ""} onChange={(e) => handleAddressFormChange("state", e.target.value)} />
                </div>
                <div className="input-group full-span">
                  <label>Google Maps Link</label>
                  <div className="inline-actions">
                    <input value={addressMapLink} onChange={(e) => setAddressMapLink(e.target.value)} />
                    <button type="button" className="btn-primary inline-btn extract-btn" onClick={handleAddressMapExtract}>
                      <MapPin size={16} />
                      Extract
                    </button>
                  </div>
                </div>
                <div className="input-group">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={addressForm.latitude ?? ""}
                    onChange={(e) =>
                      handleAddressFormChange("latitude", e.target.value ? Number(e.target.value) : null)
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={addressForm.longitude ?? ""}
                    onChange={(e) =>
                      handleAddressFormChange("longitude", e.target.value ? Number(e.target.value) : null)
                    }
                  />
                </div>
                <div className="input-group checkbox-group">
                  <label>IsDefault</label>
                  <input
                    type="checkbox"
                    checked={Boolean(addressForm.isDefault)}
                    onChange={(e) => handleAddressFormChange("isDefault", e.target.checked)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary modal-btn" onClick={() => setShowAddressModal(false)}>
                Cancel
              </button>
              <button className="btn-primary modal-btn" onClick={handleSaveAddress}>
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      <AppDialog
        open={Boolean(dialogMessage)}
        title="Create Lead"
        message={dialogMessage}
        mode="alert"
        onConfirm={() => setDialogMessage("")}
        onClose={() => setDialogMessage("")}
      />

      <AppLoader open={loading} message={loaderMessage || "Please wait..."} />
    </div>
  );
};

export default LeadCreate;
