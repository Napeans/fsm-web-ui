import { useState } from "react";
import { Search, MapPin, Send, PlusCircle } from "lucide-react";
import { fetchCustomerByMobile, createLead, createCustomerAddress } from "./lead.service";
import { extractLatLng } from "../../utils/mapUtils";
import "./LeadCreate.css";
import type { CustomerCreateRequest, CreateCustomerAddressRequest, CreateLeadRequest } from "./lead.types";

const LeadCreate = () => {
  const [mobile, setMobile] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [serviceTypeId, setServiceTypeId] = useState<number>(0);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleHour, setScheduleHour] = useState("");
  const [scheduleMinute, setScheduleMinute] = useState("");
  const [schedulePeriod, setSchedulePeriod] = useState<"AM" | "PM">("AM");
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
    whatsappNo: "",
    emailId: "",
  });

  const isExistingCustomer = activeCustomerId > 0;
  const hourOptions = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const minuteOptions = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

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
    if (!mobile.trim()) {
      alert("Enter mobile number");
      return;
    }

    setHasSearched(true);
    setSelectedAddressId(0);
    setDraftAddress(null);

    try {
      const data = await fetchCustomerByMobile(mobile.trim());

      if (data && !data.IsNewCustomer) {
        const customerId = Number(data.CustomerId ?? data.customerId ?? 0);
        const addressList = data.Addresses ?? data.addresses ?? [];

        setCustomer(data);
        setActiveCustomerId(customerId);
        setAddresses(addressList);
        setCustomerForm({
          customerName: data.customerName ?? data.CustomerName ?? "",
          whatsappNo: data.whatsappNo ?? data.WhatsappNo ?? mobile,
          emailId: data.emailId ?? data.EmailId ?? "",
        });
        setLatLng(null);
        return;
      }

      setCustomer(null);
      setActiveCustomerId(0);
      setAddresses([]);
      setLatLng(null);
      setCustomerForm((prev) => ({
        ...prev,
        customerName: "",
        whatsappNo: prev.whatsappNo || mobile,
      }));
      alert("New customer detected. Add address in popup.");
    } catch (error) {
      console.error("Customer search failed", error);
      alert("Unable to search customer right now");
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
      whatsappNo: prev.whatsappNo || customer?.whatsappNo || customer?.WhatsappNo || mobile,
      emailId: prev.emailId || customer?.emailId || customer?.EmailId || "",
    }));
    setShowAddressModal(true);
  };

  const handleAddressFormChange = (
    field: keyof CreateCustomerAddressRequest,
    value: string | number | boolean | null
  ) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressMapExtract = () => {
    const result = extractLatLng(addressMapLink);
    if (!result) {
      alert("Invalid Google Map link");
      return;
    }

    handleAddressFormChange("latitude", Number(result.latitude));
    handleAddressFormChange("longitude", Number(result.longitude));
  };

  const handleSaveAddress = async () => {
    if (!addressForm.addressLine1?.trim()) {
      alert("AddressLine1 is required");
      return;
    }

    if (isExistingCustomer) {
      try {
        const payload: CustomerCreateRequest = {
          customerId: activeCustomerId,
          customerName: customerForm.customerName,
          mobileNo: mobile,
          whatsappNo: customerForm.whatsappNo,
          emailId: customerForm.emailId,
          addresse: { ...addressForm },
        };

        await createCustomerAddress(payload);

        const refreshedCustomer = await fetchCustomerByMobile(mobile);
        const refreshedAddresses = refreshedCustomer?.Addresses ?? refreshedCustomer?.addresses ?? [];
        setCustomer(refreshedCustomer);
        setAddresses(refreshedAddresses);

        if (refreshedAddresses.length > 0) {
          const lastAddress = refreshedAddresses[refreshedAddresses.length - 1];
          const addressId = Number(lastAddress.CustomerAddressId ?? lastAddress.customerAddressId ?? 0);
          setSelectedAddressId(addressId);
          resolveAddressLatLng(lastAddress);
        }

        setShowAddressModal(false);
        alert("Address added successfully");
      } catch (error) {
        console.error("Add address failed", error);
        alert("Unable to add address");
      }
      return;
    }

    if (!customerForm.customerName.trim()) {
      alert("CustomerName is required for new customer");
      return;
    }

    setDraftAddress({ ...addressForm });
    if (addressForm.latitude && addressForm.longitude) {
      setLatLng({ latitude: Number(addressForm.latitude), longitude: Number(addressForm.longitude) });
    } else {
      setLatLng(null);
    }
    setShowAddressModal(false);
  };

  const handleCreateLead = async () => {
    if (!mobile.trim()) {
      alert("Customer mobile number is required");
      return;
    }

    if (!serviceTypeId) {
      alert("Select service type");
      return;
    }

    if (!scheduleDate || !scheduleHour || !scheduleMinute) {
      alert("Select schedule date and time");
      return;
    }

    const hour12 = Number(scheduleHour);
    let hour24 = hour12 % 12;
    if (schedulePeriod === "PM") {
      hour24 += 12;
    }
    const scheduledAt = new Date(`${scheduleDate}T00:00:00`);
    scheduledAt.setHours(hour24, Number(scheduleMinute), 0, 0);

    const basePayload = {
      serviceTypeId,
      scheduledOn: scheduledAt.toISOString(),
      remarks,
    };

    const payload: CreateLeadRequest = isExistingCustomer
      ? {
          ...basePayload,
          customerId: activeCustomerId,
          customerAddressId: selectedAddressId,
        }
      : {
          ...basePayload,
          customerName: customerForm.customerName,
          mobileNo: mobile,
          whatsappNo: customerForm.whatsappNo,
          emailId: customerForm.emailId,
          addresse: draftAddress ?? undefined,
        };

    if (isExistingCustomer && !payload.customerAddressId) {
      alert("Select an address");
      return;
    }

    try {
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
          alert("For new customer, fill name, mobile and address details");
          return;
        }

        await createCustomerAddress({
          customerId: 0,
          customerName: payload.customerName,
          mobileNo: payload.mobileNo,
          whatsappNo: payload.whatsappNo,
          emailId: payload.emailId,
          addresse: address,
        });
      }

      await createLead(payload);
      alert("Lead created successfully");
    } catch (error) {
      console.error("Create lead failed", error);
      alert("Unable to create lead");
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
          <div className="card-header">
            <Search size={18} />
            <h3>Customer Details</h3>
          </div>
          <div className="card-body">
            <div className="input-group">
              <label>Customer Mobile Number</label>
              <div className="search-control-group">
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
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
            </div>

            {hasSearched && (
              <div className="customer-info">
                <h4>{isExistingCustomer ? customer?.customerName ?? customer?.CustomerName : "New customer"}</h4>

                {isExistingCustomer ? (
                  <p className="help-text">Customer Name: {customerForm.customerName || "-"}</p>
                ) : (
                  <div className="input-group">
                    <label>Customer Name</label>
                    <input
                      value={customerForm.customerName}
                      onChange={(e) => setCustomerForm((prev) => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter customer name"
                    />
                  </div>
                )}

                {isExistingCustomer && addresses.length > 0 && (
                  <div className="input-group">
                    <label>Select Address</label>
                    <select value={selectedAddressId || ""} onChange={(e) => handleAddressSelect(e.target.value)}>
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
                  </div>
                )}

                {!isExistingCustomer && draftAddress && (
                  <div className="draft-address-preview">
                    <p className="help-text">Address added in draft. It will be submitted with Create Lead.</p>
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
                  </div>
                )}

                <button className="btn-outline add-address-btn" onClick={openAddressModal}>
                  + Add New Address
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-card">
          <div className="card-header">
            <PlusCircle size={18} />
            <h3>Service Details</h3>
          </div>
          <div className="card-body">
            <div className="input-group">
              <label>Select Service Type</label>
              <select value={serviceTypeId || ""} onChange={(e) => setServiceTypeId(Number(e.target.value))}>
                <option value="">Choose a service...</option>
                <option value={1}>AC Installation</option>
                <option value={2}>AC Servicing</option>
                <option value={3}>Gas Filling</option>
              </select>
            </div>

            <div className="input-group">
              <label>Schedule Date & Time</label>
              <div className="schedule-group">
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
                <select value={scheduleHour} onChange={(e) => setScheduleHour(e.target.value)}>
                  <option value="">HH</option>
                  {hourOptions.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
                <select value={scheduleMinute} onChange={(e) => setScheduleMinute(e.target.value)}>
                  <option value="">MM</option>
                  {minuteOptions.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>
                <select value={schedulePeriod} onChange={(e) => setSchedulePeriod(e.target.value as "AM" | "PM")}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
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
          </div>
        </div>

        <div className="form-card full-width">
          <div className="card-header">
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

            <div className="button-row">
              <button className="btn-primary" onClick={handleCreateLead}>
                <Send size={16} />
                Create Lead
              </button>
            </div>
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
                  <div className="input-group">
                    <label>CustomerName</label>
                    <input
                      value={customerForm.customerName}
                      onChange={(e) => setCustomerForm((prev) => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Customer name"
                    />
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
                  <label>AddressLine1</label>
                  <input
                    value={addressForm.addressLine1 ?? ""}
                    onChange={(e) => handleAddressFormChange("addressLine1", e.target.value)}
                  />
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
                <div className="input-group">
                  <label>Pincode</label>
                  <input
                    value={addressForm.pincode ?? ""}
                    onChange={(e) => handleAddressFormChange("pincode", e.target.value)}
                  />
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
    </div>
  );
};

export default LeadCreate;
