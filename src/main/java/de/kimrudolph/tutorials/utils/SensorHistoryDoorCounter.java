package de.kimrudolph.tutorials.utils;

public class SensorHistoryDoorCounter {
	
	private Data data;

	public Data getData() {
		return data;
	}

	public void setData(Data data) {
		this.data = data;
	}

	public class Data {
			
		private String value;
		
		public String getValue() {
			return value;
		}
		public void setValue(String value) {
			this.value = value;
			
		}
		@Override
		public String toString() {
			return "Data [value=" + value + "]";
		}
		
		
	}

	@Override
	public String toString() {
		return "SensorHistoryDoorCounter [data=" + data + "]";
	}
	
	
	
}
