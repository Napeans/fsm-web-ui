import { useState } from "react";
import { Search, MapPin, Send, PlusCircle } from "lucide-react";
import { fetchCustomerByMobile, createLead } from "./lead.service";
import { extractLatLng } from "../../utils/mapUtils";
import "./LeadCreate.module.css"; // Ensure this matches the new CSS filename

const LeadCreate = () => {
  const [mobile, setMobile] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [serviceTypeId, setServiceTypeId] = useState<number>(0);
  const [mapInput, setMapInput] = useState("");
  const [latLng, setLatLng] = useState<any>(null);

  const handleMobileSearch = async () => {
    const data = await fetchCustomerByMobile(mobile);
    if (data) {
      if (data.IsNewCustomer) {
        setCustomer(null);
        setAddresses([]);
        alert("New customer - please add address");
        return;
      }
      setCustomer(data);
      setAddresses(data.Addresses);
    } else {
      alert("New Customer - please add address");
    }
  };

  const handleMapPaste = () => {
    const result = extractLatLng(mapInput);
    if (result) setLatLng(result);
    else alert("Invalid Google Map link");
  };

  const handleCreateLead = async () => {
    await createLead({
      customerId: customer?.CustomerId,
      customerAddressId: selectedAddressId,
      serviceTypeId,
      scheduledOn: new Date().toISOString(),
      remarks: "",
    });
    alert("Lead Created Successfully");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Create New Lead</h1>
        <p>Search for a customer and provide service details to generate a lead.</p>
      </div>

      <div className="form-grid">
        {/* Section 1: Customer Search */}
        <div className="form-card">
          <div className="card-header">
            <Search size={18} />
            <h3>Customer Search</h3>
          </div>
          <div className="card-body">
            <div className="input-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                placeholder="e.g. +1 234 567 890"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <button className="btn-secondary" onClick={handleMobileSearch}>
              <Search size={16} />
              Search Customer
            </button>

            {customer && (
              <div className="customer-info">
                <h4>{customer.customerName}</h4>
                {addresses.length > 0 && (
                  <div className="input-group">
                    <label>Select Address</label>
                    <select onChange={(e) => setSelectedAddressId(Number(e.target.value))}>
                      <option value="">Choose an address...</option>
                      {addresses.map((a) => (
                        <option key={a.CustomerAddressId} value={a.CustomerAddressId}>
                          {a.AddressType}: {a.Area} ({a.Pincode})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Service Details */}
        <div className="form-card">
          <div className="card-header">
            <PlusCircle size={18} />
            <h3>Service Details</h3>
          </div>
          <div className="card-body">
            <div className="input-group">
              <label>Select Service Type</label>
              <select onChange={(e) => setServiceTypeId(Number(e.target.value))}>
                <option value="">Choose a service...</option>
                <option value={1}>AC Installation</option>
                <option value={2}>AC Servicing</option>
                <option value={3}>Gas Filling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Location (Full Width) */}
        <div className="form-card full-width">
          <div className="card-header">
            <MapPin size={18} />
            <h3>Location Information</h3>
          </div>
          <div className="card-body">
            <div className="input-group">
              <label>Google Maps / WhatsApp Link</label>
              <input
                placeholder="Paste link here..."
                value={mapInput}
                onChange={(e) => setMapInput(e.target.value)}
              />
            </div>
            
            <div className="button-row">
              <button className="btn-outline" onClick={handleMapPaste}>
                <MapPin size={16} />
                Extract Location
              </button>
              <button 
                className="btn-primary" 
                onClick={handleCreateLead}
                disabled={!customer || !selectedAddressId || !serviceTypeId}
              >
                <Send size={16} />
                Create Lead
              </button>
            </div>

            {latLng && (
              <div className="map-preview">
                <iframe
                  width="100%"
                  height="250"
                  src={`https://maps.google.com/maps?q=${latLng.latitude},${latLng.longitude}&output=embed`}
                  style={{ border: 0, borderRadius: '8px', marginTop: '15px' }}
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCreate;