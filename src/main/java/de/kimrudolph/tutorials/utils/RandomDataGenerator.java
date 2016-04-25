package de.kimrudolph.tutorials.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.messaging.simp.broker.BrokerAvailabilityEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

@Component
public class RandomDataGenerator implements
    ApplicationListener<BrokerAvailabilityEvent> {

    private final MessageSendingOperations<String> messagingTemplate;
    
    private Double previousCount = 0D;
    
    private final String USER_AGENT = "Mozilla/5.0";

    @Autowired
    public RandomDataGenerator(
        final MessageSendingOperations<String> messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onApplicationEvent(final BrokerAvailabilityEvent event) {
    }

    @Scheduled(fixedDelay = 4000)
    public void sendDataUpdates() throws IOException {
    	
    		String url = "https://mythings-builder-backend.proximus.be/sensorhistory/doorcounter?timespan=minute";
    		
    		HttpResponse response = makeRequest(url);
    		final String responseJson = EntityUtils.toString(response.getEntity());
    		
    		Gson gson = createGson();
    		
    		Type listType = new TypeToken<ArrayList<SensorHistoryDoorCounter>>() {}.getType();
    		
    		List<SensorHistoryDoorCounter> list=  gson.fromJson(responseJson, listType );

    		
    		//print result
    		if(!list.isEmpty()){
    			this.messagingTemplate.convertAndSend(
    		            "/data", Double.valueOf(list.get(list.size() -1) .getTotalCount()));	
    			previousCount = Double.valueOf(list.get(list.size() -1) .getTotalCount());
    		}else{
    			this.messagingTemplate.convertAndSend(
    		            "/data", previousCount);
    		}
    	
    }
    
    private static HttpResponse makeRequest(String uri) {
	    try {
	        HttpGet httpGet = new HttpGet(uri);
	        httpGet.setHeader("Accept", "application/json");
	        httpGet.setHeader("Content-type", "application/json");
	        return new DefaultHttpClient().execute(httpGet);
	    } catch (UnsupportedEncodingException e) {
	        e.printStackTrace();
	    } catch (ClientProtocolException e) {
	        e.printStackTrace();
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	    return null;
	}
    
    private Gson createGson(){
		GsonBuilder builder = new GsonBuilder();
		Gson gson = builder.create();
		return gson;
	}
}