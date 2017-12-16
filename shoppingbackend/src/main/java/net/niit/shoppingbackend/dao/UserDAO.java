package net.niit.shoppingbackend.dao;

import java.util.List;

import net.niit.shoppingbackend.dto.Address;
import net.niit.shoppingbackend.dto.Cart;
import net.niit.shoppingbackend.dto.User;

public interface UserDAO {

	// user related operation
	User getByEmail(String email);
	User get(int id);

	boolean add(User user);
	
	// adding and updating a new address
	Address getAddress(int addressId);
	boolean addAddress(Address address);
	boolean updateAddress(Address address);
	Address getBillingAddress(int userId);
	List<Address> listShippingAddresses(int userId);
	

	
}
