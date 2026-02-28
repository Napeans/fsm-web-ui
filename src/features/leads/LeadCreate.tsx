import { useState } from "react";
import { fetchCustomerByMobile, createLead } from "./lead.service";
import { extractLatLng } from "../../utils/mapUtils";

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
      customerId: customer.CustomerId,
      customerAddressId: selectedAddressId,
      serviceTypeId,
      scheduledOn: new Date().toISOString(),
      remarks: "",
    });

    alert("Lead Created");
  };

  return (
    <div className="form-container">
      <h2>Create Lead</h2>

      <input
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button className="btn-primary" onClick={handleMobileSearch}>Search</button>

      {customer && (
        <>
          <h4>{customer.customerName}</h4>

          {addresses.length > 1 && (
            <select onChange={(e) => setSelectedAddressId(Number(e.target.value))}>
              <option>Select Address</option>
              {addresses.map((a) => (
                <option key={a.CustomerAddressId} value={a.CustomerAddressId}>
                  {a.AddressType} - {a.AddressLine1} - {a.Area} - {a.Pincode}
                </option>
              ))}
            </select>
          )}
        </>
      )}

      <select onChange={(e) => setServiceTypeId(Number(e.target.value))}>
        <option>Select Service</option>
        <option value={1}>AC Installation</option>
        <option value={2}>AC Servicing</option>
        <option value={3}>Gas Filling</option>
      </select>

      <h4>Paste Google Map Link</h4>
      <input
        placeholder="Paste WhatsApp Location Link"
        value={mapInput}
        onChange={(e) => setMapInput(e.target.value)}
      />
      <button className="btn-primary" onClick={handleMapPaste}>Extract Location</button>

      {latLng && (
        <iframe
          width="100%"
          height="250"
          src={`https://www.google.com/maps?q=${latLng.latitude},${latLng.longitude}&output=embed`}
        ></iframe>
      )}

      <button className="btn-primary" onClick={handleCreateLead}>Create Lead</button>
    </div>
  );
};

export default LeadCreate;