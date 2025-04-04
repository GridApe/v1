
## **📌 Flow Breakdown**
### **1️⃣ User Starts the Process**
- User navigates to the **email template generator** page.
- They click on **"Create New Email Template"**.

---

### **2️⃣ System Asks the User Key Questions**
The system presents a **multi-step form** asking:
1. **Email Type** → What type of email do you want to generate?
   - 📌 Options: **Marketing, Transactional, Newsletter, Event, Onboarding, Abandoned Cart**  
2. **Purpose** → Describe the goal of the email.
   - 📌 Example: "Announcing a new product launch with a 50% discount."  
3. **Brand Tone** → What should the email tone be?
   - 📌 Options: **Professional, Friendly, Persuasive, Minimalist**  
4. **Images** → Should images be included?
   - 📌 ✅ Yes / ❌ No  
5. **Call-to-Action (CTA)** → Should the email have a CTA button?
   - 📌 ✅ Yes (Specify text like "Shop Now") / ❌ No  
6. **Language** → What language should the email be in?
   - 📌 Options: **English, Spanish, French, German**  
7. **Mobile Optimization** → Should the email be mobile-friendly?
   - 📌 ✅ Yes / ❌ No  

---

### **3️⃣ User Submits the Form**
- The system collects all responses.
- It **dynamically constructs** an AI prompt based on user input.

---

### **4️⃣ AI Generates the Email Template**
- The **constructed prompt** is sent to OpenAI (GPT-4).
- OpenAI **returns a JSON response** in Unlayer’s email format.
- The system **validates the JSON structure** before rendering.

---

### **5️⃣ User Reviews & Edits the Email**
- The generated email **loads into the Unlayer Editor**.
- User can:
  - **Modify text & images** 🔄
  - **Change layout** 🏗
  - **Preview mobile & desktop views** 📱💻

---

### **6️⃣ User Saves or Exports the Template**
- ✅ **Save to My Templates** (for later use).
- ✅ **Export as HTML** (for external use).
- ✅ **Send a Test Email** (for preview).
