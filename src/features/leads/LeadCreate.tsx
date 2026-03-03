import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Send, PlusCircle, Eraser } from "lucide-react";
import { fetchCustomerByMobile, createLead, createCustomer } from "./lead.service";
import { extractLatLng } from "../../utils/mapUtils";
import AppDialog from "../../components/AppDialog";
import AppLoader from "../../components/AppLoader";
import "./LeadCreate.css";
import type { CreateCustomerAddressRequest, CreateLeadRequest, CustomerCreateRequest } from "./lead.types";

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
  const [savedAddressPreview, setSavedAddressPreview] = useState<CreateCustomerAddressRequest | null>(null);
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
  const serviceTypeRef = useRef<HTMLSelectElement | null>(null);
  const scheduleRef = useRef<HTMLInputElement | null>(null);
  const addressLine1Ref = useRef<HTMLInputElement | null>(null);
  const areaRef = useRef<HTMLInputElement | null>(null);
  const pincodeRef = useRef<HTMLInputElement | null>(null);
  const customerNameRef = useRef<HTMLInputElement | null>(null);
  const customerGstRef = useRef<HTMLInputElement | null>(null);
  const whatsappRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const isExistingCustomer = activeCustomerId > 0;
  const showAlert = (message: string) => setDialogMessage(message);

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
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

  const applyCustomerResponse = (data: any, fallbackMobile: string) => {
    const customerId = Number(data?.CustomerId ?? data?.customerId ?? 0);
    const addressList = data?.Addresses ?? data?.addresses ?? [];

    setCustomer(data);
    setActiveCustomerId(customerId);
    setAddresses(addressList);
    setCustomerForm({
      customerName: data?.CustomerName ?? data?.customerName ?? "",
      customerGST: (data?.CustomerGST ?? data?.customerGST ?? "").toUpperCase(),
      whatsappNo: data?.WhatsappNo ?? data?.whatsappNo ?? fallbackMobile,
      emailId: data?.EmailId ?? data?.emailId ?? "",
    });

    const firstAddress = addressList[0];
    if (firstAddress) {
      const firstAddressId = Number(firstAddress.CustomerAddressId ?? firstAddress.customerAddressId ?? 0);
      setSelectedAddressId(firstAddressId);
      resolveAddressLatLng(firstAddress);
    } else {
      setSelectedAddressId(0);
      setLatLng(null);
    }
  };

  const resetAddressForm = () => {
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
  };

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
    resetAddressForm();
    setSavedAddressPreview(null);
    setCustomerForm({
      customerName: "",
      customerGST: "",
      whatsappNo: "",
      emailId: "",
    });
    setFieldErrors({});
    setNewCustomerNotice("");
  };

  const fetchPostalDetails = async (pincode: string) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      const first = Array.isArray(data) ? data[0] : null;
      const office = first?.PostOffice?.[0];
      if (!office) return;

      setAddressForm((prev) => ({
        ...prev,
        city: office.District ?? office.Block ?? office.Name ?? prev.city,
        state: office.State ?? prev.state,
      }));
    } catch (error) {
      console.error("Pincode lookup failed", error);
    }
  };

  const handleMobileSearch = async () => {
    const enteredMobile = mobile.trim();
    const errors: Record<string, string> = {};

    if (!enteredMobile) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(enteredMobile)) {
      errors.mobile = "Mobile number must be 10 digits";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      mobileRef.current?.focus();
      return;
    }

    clearFieldError("mobile");
    setNewCustomerNotice("");
    setHasSearched(true);
    setSelectedAddressId(0);

    try {
      setLoaderMessage("Searching customer...");
      setLoading(true);
      const data = await fetchCustomerByMobile(enteredMobile);

      if (data && !data.IsNewCustomer) {
        applyCustomerResponse(data, enteredMobile);
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
        whatsappNo: enteredMobile,
        emailId: "",
      }));
      setNewCustomerNotice("New customer detected. Complete details in popup to create customer.");
      resetAddressForm();
      setShowAddressModal(true);
    } catch (error) {
      console.error("Customer search failed", error);
      showAlert("Unable to search customer right now");
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const openAddressModal = () => {
    setCustomerForm((prev) => ({
      customerName: prev.customerName || customer?.CustomerName || customer?.customerName || "",
      customerGST: (prev.customerGST || customer?.CustomerGST || customer?.customerGST || "").toUpperCase(),
      whatsappNo: prev.whatsappNo || customer?.WhatsappNo || customer?.whatsappNo || mobile,
      emailId: prev.emailId || customer?.EmailId || customer?.emailId || "",
    }));
    resetAddressForm();
    setShowAddressModal(true);
  };

  const handleAddressFormChange = (field: keyof CreateCustomerAddressRequest, value: string | number | boolean | null) => {
    if (field === "pincode" && typeof value === "string") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 6);
      setAddressForm((prev) => ({ ...prev, pincode: onlyDigits }));
      clearFieldError("addressPincode");
      if (onlyDigits.length === 6) {
        void fetchPostalDetails(onlyDigits);
      }
      return;
    }

    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressMapExtract = () => {
    const result = extractLatLng(addressMapLink);
    if (!result) {
      if (addressMapLink.includes("maps.app.goo.gl")) {
        showAlert("Short Google Maps links cannot be parsed directly. Open the link and paste expanded URL containing @lat,lng or q=lat,lng.");
      } else {
        showAlert("Unable to extract coordinates. Use Google Maps URL containing @lat,lng or q=lat,lng.");
      }
      return;
    }

    setAddressForm((prev) => ({
      ...prev,
      latitude: Number(result.latitude),
      longitude: Number(result.longitude),
    }));
  };

  const validateCustomerPopup = () => {
    const errors: Record<string, string> = {};

    if (!/^\d{10}$/.test(mobile.trim())) {
      errors.mobile = "Mobile number must be 10 digits";
    }
    if (!customerForm.customerName.trim()) {
      errors.customerName = "Customer name is required";
    }
    if (customerForm.customerGST.trim() && !gstPattern.test(customerForm.customerGST.trim().toUpperCase())) {
      errors.customerGST = "Invalid GST format";
    }
    if (customerForm.whatsappNo.trim() && !/^\d{10}$/.test(customerForm.whatsappNo.trim())) {
      errors.whatsappNo = "Whatsapp number must be 10 digits";
    }
    if (customerForm.emailId.trim() && !customerForm.emailId.trim().toLowerCase().endsWith("@gmail.com")) {
      errors.emailId = "Email must end with @gmail.com";
    }
    if (!addressForm.addressLine1?.trim()) {
      errors.addressLine1 = "AddressLine1 is required";
    }
    if (!addressForm.area?.trim()) {
      errors.addressArea = "Area is required";
    }
    if (!addressForm.pincode || addressForm.pincode.length !== 6) {
      errors.addressPincode = "Pincode must be 6 digits";
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));

    if (errors.customerName) {
      customerNameRef.current?.focus();
    } else if (errors.customerGST) {
      customerGstRef.current?.focus();
    } else if (errors.whatsappNo) {
      whatsappRef.current?.focus();
    } else if (errors.emailId) {
      emailRef.current?.focus();
    } else if (errors.addressArea) {
      areaRef.current?.focus();
    } else if (errors.addressPincode) {
      pincodeRef.current?.focus();
    } else if (errors.addressLine1) {
      addressLine1Ref.current?.focus();
    }

    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateCustomerPopup()) {
      return;
    }

    const payload: CustomerCreateRequest = {
      customerId: isExistingCustomer ? activeCustomerId : null,
      customerName: customerForm.customerName.trim(),
      customerGST: customerForm.customerGST.trim().toUpperCase(),
      mobileNo: mobile.trim(),
      whatsappNo: customerForm.whatsappNo.trim(),
      emailId: customerForm.emailId.trim(),
      addresse: {
        ...addressForm,
        pincode: addressForm.pincode,
        googleMapLink: addressMapLink.trim() || undefined,
      },
    };

    try {
      setLoaderMessage(isExistingCustomer ? "Saving address..." : "Creating customer...");
      setLoading(true);
      const data = await createCustomer(payload);
      const savedCustomerId = Number(data?.CustomerId ?? data?.customerId ?? activeCustomerId ?? 0);
      const savedAddressId = Number(data?.CustomerAddressId ?? data?.customerAddressId ?? 0);

      setActiveCustomerId(savedCustomerId);
      setSelectedAddressId(savedAddressId);
      setSavedAddressPreview({
        ...addressForm,
        customerAddressId: savedAddressId,
        googleMapLink: addressMapLink.trim() || undefined,
      });

      setCustomer((prev: any) => ({
        ...(prev ?? {}),
        CustomerId: savedCustomerId,
        CustomerName: customerForm.customerName,
        MobileNo: mobile.trim(),
      }));
      setAddresses((prev) => {
        const localAddress = {
          CustomerAddressId: savedAddressId,
          AddressType: addressForm.addressType,
          AddressLine1: addressForm.addressLine1,
          Area: addressForm.area,
          City: addressForm.city,
          State: addressForm.state,
          Pincode: addressForm.pincode,
          Latitude: addressForm.latitude,
          Longitude: addressForm.longitude,
        };
        const existing = prev.filter((a) => Number(a.CustomerAddressId ?? a.customerAddressId ?? 0) !== savedAddressId);
        return [...existing, localAddress];
      });
      if (addressForm.latitude != null && addressForm.longitude != null) {
        setLatLng({ latitude: Number(addressForm.latitude), longitude: Number(addressForm.longitude) });
      }
      setNewCustomerNotice("");
      setShowAddressModal(false);
      setHasSearched(true);
    } catch (error) {
      console.error("Create customer/address failed", error);
      showAlert("Unable to save customer/address");
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const handleCreateLead = async () => {
    const errors: Record<string, string> = {};

    if (!/^\d{10}$/.test(mobile.trim())) {
      errors.mobile = "Mobile number must be 10 digits";
    }
    if (!serviceTypeId) {
      errors.serviceTypeId = "Select service type";
    }
    if (!scheduledDateTime) {
      errors.scheduledDateTime = "Select schedule date and time";
    }
    if (!activeCustomerId) {
      errors.customerId = "Search and create/select customer first";
    }
    if (!selectedAddressId) {
      errors.selectedAddressId = "Select address";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      if (errors.mobile) {
        mobileRef.current?.focus();
      } else if (errors.serviceTypeId) {
        serviceTypeRef.current?.focus();
      } else if (errors.scheduledDateTime) {
        scheduleRef.current?.focus();
      }
      return;
    }

    const payload: CreateLeadRequest = {
      customerId: activeCustomerId,
      customerAddressId: selectedAddressId,
      serviceTypeId,
      scheduledOn: new Date(scheduledDateTime).toISOString(),
      remarks,
    };

    try {
      setLoaderMessage("Creating lead...");
      setLoading(true);
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
    clearFieldError("selectedAddressId");
    const selected = addresses.find((a) => Number(a.CustomerAddressId ?? a.customerAddressId ?? 0) === addressId);
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
                  maxLength={10}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(onlyDigits);
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

                {isExistingCustomer && (
                  <p className="help-text">Customer Name: {customerForm.customerName || "-"}</p>
                )}

                {isExistingCustomer && addresses.length > 0 && (
                  <div className="input-group">
                    <label>Select Address</label>
                    <select
                      className={fieldErrors.selectedAddressId ? "input-error" : ""}
                      value={selectedAddressId || ""}
                      onChange={(e) => handleAddressSelect(e.target.value)}
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

                <button className="btn-outline add-address-btn" onClick={openAddressModal}>
                  + Add New Address
                </button>
                {savedAddressPreview && (
                  <div className="draft-address-preview">
                    <p className="help-text"><strong>Added Address</strong></p>
                    <p className="help-text">
                      <strong>Type:</strong> {savedAddressPreview.addressType || "-"} | <strong>Area:</strong> {savedAddressPreview.area || "-"} | <strong>Pincode:</strong> {savedAddressPreview.pincode || "-"}
                    </p>
                    <p className="help-text">
                      <strong>Address:</strong> {savedAddressPreview.addressLine1 || "-"}
                    </p>
                  </div>
                )}
                {fieldErrors.customerId && <p className="error-text">{fieldErrors.customerId}</p>}
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
                />
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
              <h3>{isExistingCustomer ? "Add New Address" : "Create New Customer"}</h3>
            </div>

            <div className="modal-body">
              <div className="modal-grid">
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
                    placeholder="GST number"
                  />
                  {fieldErrors.customerGST && <p className="error-text">{fieldErrors.customerGST}</p>}
                </div>

                <div className="input-group">
                  <label>MobileNo</label>
                  <input value={mobile} readOnly />
                </div>

                <div className="input-group">
                  <label>WhatsappNo</label>
                  <input
                    ref={whatsappRef}
                    className={fieldErrors.whatsappNo ? "input-error" : ""}
                    value={customerForm.whatsappNo}
                    maxLength={10}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setCustomerForm((prev) => ({ ...prev, whatsappNo: onlyDigits }));
                      clearFieldError("whatsappNo");
                    }}
                  />
                  {fieldErrors.whatsappNo && <p className="error-text">{fieldErrors.whatsappNo}</p>}
                </div>

                <div className="input-group">
                  <label>EmailId</label>
                  <input
                    ref={emailRef}
                    type="email"
                    className={fieldErrors.emailId ? "input-error" : ""}
                    value={customerForm.emailId}
                    onChange={(e) => {
                      setCustomerForm((prev) => ({ ...prev, emailId: e.target.value }));
                      clearFieldError("emailId");
                    }}
                    placeholder="example@gmail.com"
                  />
                  {fieldErrors.emailId && <p className="error-text">{fieldErrors.emailId}</p>}
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
                  <input
                    ref={areaRef}
                    className={fieldErrors.addressArea ? "input-error" : ""}
                    value={addressForm.area ?? ""}
                    onChange={(e) => {
                      handleAddressFormChange("area", e.target.value);
                      clearFieldError("addressArea");
                    }}
                  />
                  {fieldErrors.addressArea && <p className="error-text">{fieldErrors.addressArea}</p>}
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
                    onChange={(e) => handleAddressFormChange("latitude", e.target.value ? Number(e.target.value) : null)}
                  />
                </div>

                <div className="input-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={addressForm.longitude ?? ""}
                    onChange={(e) => handleAddressFormChange("longitude", e.target.value ? Number(e.target.value) : null)}
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
              <button className="btn-primary modal-btn" onClick={() => void handleSaveAddress()}>
                Save
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
